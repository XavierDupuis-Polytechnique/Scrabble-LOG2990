/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-vars */
import { OnlineGameSettingsUI } from '@app/game-manager/game-settings-multi.interface';
import { NewOnlineGameService } from '@app/game-manager/new-online-game.service';
import { createSinonStubInstance, StubbedClass } from '@app/test.util';
import { expect } from 'chai';
import { createServer, Server } from 'http';
import { beforeEach } from 'mocha';
import { AddressInfo } from 'net';
import * as sinon from 'sinon';
import { Socket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { NewOnlineGameSocketHandler } from './new-online-game-manager';

describe('New Online Game Service', () => {
    let handler: NewOnlineGameSocketHandler;
    let clientSocket: ClientSocket;
    let serverSocket: Socket;
    let port: number;
    let httpServer: Server;
    let newOnlineGameService: StubbedClass<NewOnlineGameService>;
    const pendingGames = [
        { id: '1', playerName: 'Max', randomBonus: true, timePerTurn: 61000 },
        { id: '2', playerName: 'Tom', randomBonus: true, timePerTurn: 64000 },
        { id: '3', playerName: 'Sim', randomBonus: false, timePerTurn: 63000 },
    ];

    before((done) => {
        httpServer = createServer();
        httpServer.listen(() => {
            process.setMaxListeners(0);
            port = (httpServer.address() as AddressInfo).port;
            // no warning but slow
            newOnlineGameService = createSinonStubInstance<NewOnlineGameService>(NewOnlineGameService);

            handler = new NewOnlineGameSocketHandler(httpServer, newOnlineGameService);
            handler.newGameHandler();
            handler.ioServer.on('connection', (socket: Socket) => {
                serverSocket = socket;
            });
            done();
        });
    });
    beforeEach((done) => {
        clientSocket = Client(`http://localhost:${port}`, { path: '/newGame' });
        clientSocket.on('connect', done);
    });
    afterEach(() => {
        sinon.verifyAndRestore();
        clientSocket.close();
    });

    after(() => {
        httpServer.close();
    });

    it('should create pendingGame', (done) => {
        const gameSettings = { playerName: 'Max', randomBonus: true, timePerTurn: 60000 };
        serverSocket.on('createGame', (pendingGameSettings: OnlineGameSettingsUI) => {
            expect(pendingGameSettings).to.deep.equal(gameSettings);
            done();
        });
        clientSocket.emit('createGame', gameSettings);
    });

    it('should receive pendingGameId on create', (done) => {
        const gameSettings = { playerName: 'Max', randomBonus: true, timePerTurn: 60000 };
        clientSocket.on('pendingGameId', (pendingId: string) => {
            expect(pendingId).to.not.be.undefined;
            done();
        });
        clientSocket.emit('createGame', gameSettings);
    });

    it('should receive pendingGameId on create', (done) => {
        const gameSettings = { playerName: 'Max', randomBonus: true, timePerTurn: 60000 };
        clientSocket.on('pendingGameId', (pendingId: string) => {
            expect(pendingId).to.not.be.undefined;
            done();
        });
        clientSocket.emit('createGame', gameSettings);
    });

    // it('should receive gameToken on joinGame', (done) => {
    //     sinon.stub(newOnlineGameService, 'createPendingGame').get(() => {
    //         return '1';
    //     });
    //     sinon.stub(newOnlineGameService, 'getPendingGames').get(() => {
    //         return pendingGames;
    //     });
    //     let id = '';
    //     let gameTokenPlayer1 = '';
    //     const playerName = 'Allo';
    //     const gameSettings = { playerName: 'Max', randomBonus: true, timePerTurn: 60000 };
    //     const clientSocket2 = Client(`http://localhost:${port}`, { path: '/newGame', multiplex: false });

    //     clientSocket2.on('pendingGameId', (pendingId: string) => {
    //         id = pendingId;
    //         console.log(pendingId);
    //         clientSocket.emit('joinGame', id, playerName);
    //     });
    //     clientSocket.on('gameJoined', (gameToken: string) => {
    //         gameTokenPlayer1 = gameToken;
    //     });
    //     clientSocket2.on('gameJoined', (gameToken: string) => {
    //         expect(gameTokenPlayer1).to.deep.equal(gameTokenPlayer1);
    //         done();
    //     });
    //     clientSocket2.emit('createGame', gameSettings);
    // });
});
