/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { MAX_MESSAGE_LENGTH } from '@app/constants';
import { MessagesSocketHandler, SYSTEM_MESSAGES } from '@app/messages-service/message-socket-handler/messages-socket-handler.service';
import { Message } from '@app/messages-service/message.interface';
import { GlobalSystemMessage, IndividualSystemMessage, SystemMessage } from '@app/messages-service/system-message.interface';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';
import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
import { Subject } from 'rxjs';
import * as sinon from 'sinon';
import { Socket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';

describe('MessagesService', () => {
    let handler: MessagesSocketHandler;
    let clientSocket: ClientSocket;
    let serverSocket: Socket;
    let port: number;
    let httpServer: Server;
    const mockGlobalSystemMessages$ = new Subject<GlobalSystemMessage>();
    const mockIndividualSystemMessages$ = new Subject<IndividualSystemMessage>();
    before((done) => {
        httpServer = createServer();
        httpServer.listen(() => {
            port = (httpServer.address() as AddressInfo).port;
            const systemMessagesService = createSinonStubInstance<SystemMessagesService>(SystemMessagesService);
            sinon.stub(systemMessagesService, 'globalSystemMessages$').get(() => mockGlobalSystemMessages$);
            sinon.stub(systemMessagesService, 'individualSystemMessages$').get(() => mockIndividualSystemMessages$);
            handler = new MessagesSocketHandler(httpServer, systemMessagesService);
            handler.handleSockets();
            handler.sio.on('connection', (socket) => {
                serverSocket = socket;
            });
            done();
        });
    });

    beforeEach((done) => {
        clientSocket = Client(`http://localhost:${port}`, { path: '/messages' });
        clientSocket.on('connect', done);
    });

    afterEach(() => {
        clientSocket.close();
    });

    after(() => {
        httpServer.close();
    });

    it('should create new user', (done) => {
        const userName = 'test';
        clientSocket.emit('userName', userName);
        serverSocket.once('userName', () => {
            const user = [...handler.users.values()][0];
            expect(user.name).to.equal(userName);
            done();
        });
    });

    it('should join room', (done) => {
        const userName = 'test';
        clientSocket.emit('userName', userName);
        const roomID = 'abc';
        clientSocket.emit('joinRoom', roomID);
        serverSocket.on('joinRoom', () => {
            expect(handler.activeRooms.has(roomID)).to.be.true;
            done();
        });
    });

    it('should send message to other user in room', (done) => {
        const clientSocket2 = Client(`http://localhost:${port}`, { path: '/messages', multiplex: false });

        const userName1 = 'test';
        clientSocket.emit('userName', userName1);
        const userName2 = 'test2';
        clientSocket2.emit('userName', userName2);

        const roomID = 'abc';
        clientSocket.emit('joinRoom', roomID);
        clientSocket2.emit('joinRoom', roomID);

        const messageContent = 'Hi!';
        const expectedMessage: Message = {
            from: userName2,
            content: messageContent,
        };
        clientSocket.on('roomMessages', (message: Message) => {
            expect(message).to.deep.equal(expectedMessage);
            done();
        });
        clientSocket2.emit('newMessage', messageContent);
    });

    it('should not send message to user in other room', (done) => {
        const clientSocket2 = Client(`http://localhost:${port}`, { path: '/messages', multiplex: false });

        const userName1 = 'test';
        clientSocket.emit('userName', userName1);
        const userName2 = 'test2';
        clientSocket2.emit('userName', userName2);

        const roomID1 = 'abc';
        clientSocket.emit('joinRoom', roomID1);
        const roomID2 = 'def';
        clientSocket2.emit('joinRoom', roomID2);

        let receivedMessage = false;
        clientSocket.on('roomMessages', () => {
            receivedMessage = true;
        });

        const messageContent = 'Hi!';
        clientSocket2.emit('newMessage', messageContent);

        setTimeout(() => {
            expect(receivedMessage).to.be.false;
            clientSocket2.close();
            done();
        }, 30);
    });

    it('client should receive error when setting two userName', (done) => {
        const name = 'hello';
        clientSocket.emit('userName', name);
        clientSocket.once('error', (errorMessage: string) => {
            expect(errorMessage).to.equal("Vous avez déjà choisi un nom d'utilisateur");
            done();
        });
        clientSocket.emit('userName', name);
    });

    it('client should receive error when sending message with no userName', (done) => {
        const content = 'hello';
        clientSocket.once('error', (errorMessage: string) => {
            expect(errorMessage).to.equal("Vous n'avez pas encore entré votre nom dans notre systême");
            done();
        });
        clientSocket.emit('newMessage', content);
    });

    it('client should receive error when sending message with message over max length allowed', (done) => {
        const name = 'hello';
        clientSocket.emit('userName', name);
        const bigContent = 'a'.repeat(MAX_MESSAGE_LENGTH + 1);
        clientSocket.once('error', (errorMessage: string) => {
            expect(errorMessage).to.equal('Le message doit être plus petit que 512 charactères');
            done();
        });
        clientSocket.emit('newMessage', bigContent);
    });

    it('client should receive error when message sent without joining a room', (done) => {
        const name = 'hello';
        clientSocket.emit('userName', name);
        clientSocket.once('error', (errorMessage: string) => {
            expect(errorMessage).to.equal("Vous n'avez pas rejoint de salle de chat");
            done();
        });
        const content = 'hi';
        clientSocket.emit('newMessage', content);
    });

    it('client should receive an error when sending message in a not active room', (done) => {
        const name = 'hello';
        clientSocket.emit('userName', name);
        clientSocket.once('error', (errorMessage: string) => {
            expect(errorMessage).to.equal("La salle de chat n'est plus active");
            done();
        });

        const roomID = 'abc';
        clientSocket.emit('joinRoom', roomID);
        serverSocket.on('joinRoom', () => {
            handler.activeRooms.delete(roomID);
        });

        const content = 'hi';
        clientSocket.emit('newMessage', content);
    });

    it('client should receive an error when sending message in a not active room', (done) => {
        const name = 'hello';
        clientSocket.emit('userName', name);
        clientSocket.once('error', (errorMessage: string) => {
            expect(errorMessage).to.equal("La salle de chat n'est plus active");
            done();
        });

        const roomID = 'abc';
        clientSocket.emit('joinRoom', roomID);
        serverSocket.on('joinRoom', () => {
            handler.activeRooms.delete(roomID);
        });

        const content = 'hi';
        clientSocket.emit('newMessage', content);
    });

    it('client should receive an error when joining a room without user name', (done) => {
        clientSocket.once('error', (errorMessage: string) => {
            expect(errorMessage).to.equal("Vous n'avez pas encore choisi un nom");
            done();
        });
        const roomID = 'abc';
        clientSocket.emit('joinRoom', roomID);
    });

    it('client should receive an error when joinning a room multiple times', (done) => {
        clientSocket.once('error', (errorMessage: string) => {
            expect(errorMessage).to.equal('Vous êtes déjà dans une salle');
            done();
        });
        const name = 'allo';
        clientSocket.emit('userName', name);
        const roomID1 = 'abc';
        clientSocket.emit('joinRoom', roomID1);
        const roomID2 = 'def';
        clientSocket.emit('joinRoom', roomID2);
    });

    it('should delete user on deconnection', (done) => {
        const name = 'allo';
        clientSocket.emit('userName', name);

        serverSocket.on('disconnect', () => {
            const socketID = serverSocket.id;
            expect(handler.users.has(socketID)).to.be.false;
            done();
        });

        clientSocket.close();
    });

    it('should delete room on when no user in it', (done) => {
        const name = 'allo';
        clientSocket.emit('userName', name);

        const roomID = 'abc';
        clientSocket.emit('joinRoom', roomID);

        serverSocket.on('disconnect', () => {
            expect(handler.activeRooms.has(roomID)).to.be.false;
            done();
        });

        clientSocket.close();
    });

    it('should create room when a new user joins it', (done) => {
        const name = 'allo';
        clientSocket.emit('userName', name);

        const roomID = 'abc';
        serverSocket.on('joinRoom', () => {
            expect(handler.activeRooms.has(roomID)).to.be.true;
            done();
        });

        clientSocket.emit('joinRoom', roomID);
    });

    it('should receive global system message', (done) => {
        const name = 'abc';
        clientSocket.emit('userName', name);
        const room = 'abc';
        clientSocket.emit('joinRoom', room);
        serverSocket.on('joinRoom', () => {
            mockGlobalSystemMessages$.next(sysMessage);
        });
        const sysMessage: GlobalSystemMessage = {
            content: 'allo',
            gameToken: room,
        };
        clientSocket.on(SYSTEM_MESSAGES, (message: SystemMessage) => {
            expect(message).to.deep.equal(sysMessage.content);
            done();
        });
    });

    it('should send individual system message', (done) => {
        const playerName = 'abc';
        clientSocket.emit('userName', playerName);
        const gameToken = 'def';
        clientSocket.emit('joinRoom', gameToken);
        serverSocket.on('joinRoom', () => {
            mockIndividualSystemMessages$.next(sysMessage);
        });
        const sysMessage: IndividualSystemMessage = {
            content: 'allo',
            gameToken,
            playerName,
        };
        clientSocket.on(SYSTEM_MESSAGES, (message: SystemMessage) => {
            expect(message).to.deep.equal(sysMessage.content);
            done();
        });
    });

    it('should throws when sending individual system message to unconnected client', (done) => {
        const playerName = 'abc';
        clientSocket.emit('userName', playerName);
        const sysMessage: IndividualSystemMessage = {
            content: 'allo',
            gameToken: '3',
            playerName,
        };
        mockIndividualSystemMessages$.next(sysMessage);
        clientSocket.on(SYSTEM_MESSAGES, () => {
            expect.fail();
        });

        setTimeout(() => {
            expect(true).be.true;
            done();
        }, 20);
    });
});
