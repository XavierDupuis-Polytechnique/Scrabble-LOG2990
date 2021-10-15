/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createServer } from 'http';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { expect } from 'chai';
import { AddressInfo } from 'net';
import { MessageHandler } from '@app/messagesService/service/messages.service';
import { Socket } from 'socket.io';
import { Message } from '@app/messagesService/service/message.interface';
import { MAX_MESSAGE_LENGTH } from '@app/constants';

describe('MessagesService', () => {
    let handler: MessageHandler;
    let clientSocket: ClientSocket;
    let serverSocket: Socket;
    let port: number;
    beforeEach((done) => {
        const httpServer = createServer();
        handler = new MessageHandler(httpServer);
        handler.handleSockets();
        httpServer.listen(() => {
            port = (httpServer.address() as AddressInfo).port;
            clientSocket = Client(`http://localhost:${port}`, { path: '/messages', multiplex: false });
            handler.sio.on('connection', (socket) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
    });

    afterEach(() => {
        clientSocket.close();
        handler.sio.close();
    });

    it('should create new user', (done) => {
        const userName = 'test';
        clientSocket.emit('userName', userName);
        serverSocket.on('userName', () => {
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
            done();
        }, 150);
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
});
