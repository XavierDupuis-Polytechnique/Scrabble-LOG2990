import { OnlineGameSettings } from '@app/game-manager/game-settings-multi.interface';
import { NewOnlineGameService } from '@app/game-manager/new-online-game.service';
import { expect } from 'chai';
import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
import { Socket } from 'socket.io';
import { Client } from 'socket.io/dist/client';
import { NewOnlineGameSocketHandler } from './new-online-game-manager';

describe('New Online Game Service', () => {
    let handler: NewOnlineGameSocketHandler;
    let clientSocket: ClientSocket;
    let serverSocket: Socket;
    let port: number;
    let httpServer: Server;
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
            const newOnlineGameService = createSinonStubInstance<NewOnlineGameService>(NewOnlineGameService);
            handler = new NewOnlineGameSocketHandler(httpServer, newOnlineGameService);
            handler.newGameHandler();
            handler.ioServer.on('connection', (socket) => {
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
        clientSocket.close();
    });

    after(() => {
        httpServer.close();
    });

    it('should create pendingGame', (done) => {
        const gameSettings = { playerName: 'Max', randomBonus: true, timePerTurn: 60000 };
        clientSocket.emit('createGame', gameSettings);
        serverSocket.on('createGame', (pendingGameSettings) => {
            const newPendingGame = {
                id: '5',
                playerName: gameSettings.playerName,
                randomBonus: gameSettings.randomBonus,
                timePerTurn: gameSettings.timePerTurn,
            };
            pendingGames.push(newPendingGame);
            serverSocket.emit('pendingGames', pendingGames);
            expect(pendingGameSettings).to.equal(gameSettings);
        });
        clientSocket.on('pendingGames', (pendingGamesReceived: OnlineGameSettings) => {
            expect(pendingGamesReceived).to.equal(pendingGames);
        });
        done();
    });

    // it('currentTime should return different dates if called later', async () => {
    //     const { body: currentTime } = await dateService.currentTime();
    //     // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    //     clock.tick(5000);
    //     const { body: now } = await dateService.currentTime();
    //     expect(new Date(currentTime)).to.be.below(new Date(now));
    // });
});
