/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-vars */
import { DEFAULT_DICTIONARY_TITLE } from '@app/game/game-logic/constants';
import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { GameMode } from '@app/game/game-mode.enum';
import { NewGameManagerService } from '@app/new-game/new-game-manager/new-game-manager.service';
import { OnlineGameSettings } from '@app/new-game/online-game.interface';
import { createSinonStubInstance, StubbedClass } from '@app/test.util';
import { expect } from 'chai';
import { createServer, Server } from 'http';
import { beforeEach } from 'mocha';
import { AddressInfo } from 'net';
import { Socket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { NewGameSocketHandler } from './new-game-socket-handler';

describe('New Online Game Service', () => {
    let handler: NewGameSocketHandler;
    let clientSocket: ClientSocket;
    let serverSocket: Socket;
    let port: number;
    let httpServer: Server;
    let newGameManagerService: StubbedClass<NewGameManagerService>;
    let dictionaryService: StubbedClass<DictionaryService>;

    before((done) => {
        httpServer = createServer();
        httpServer.listen(() => {
            process.setMaxListeners(0);
            port = (httpServer.address() as AddressInfo).port;
            newGameManagerService = createSinonStubInstance<NewGameManagerService>(NewGameManagerService);
            dictionaryService = createSinonStubInstance<DictionaryService>(DictionaryService);
            handler = new NewGameSocketHandler(httpServer, newGameManagerService, dictionaryService);
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
        clientSocket.close();
    });

    after(() => {
        httpServer.close();
    });

    it('should create pendingGame', (done) => {
        const gameSettings = {
            playerName: 'Max',
            randomBonus: true,
            timePerTurn: 60000,
            gameMode: GameMode.Classic,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        serverSocket.on('createGame', () => {
            expect(newGameManagerService.createPendingGame.calledWith(gameSettings)).to.be.true;
            done();
        });
        clientSocket.emit('createGame', gameSettings);
    });

    it('should receive pendingGameId on create', (done) => {
        const id = 'abc';
        newGameManagerService.createPendingGame.returns(id);
        const gameSettings = { playerName: 'Max', randomBonus: true, timePerTurn: 60000 };
        clientSocket.on('pendingGameId', (pendingId: string) => {
            expect(pendingId).to.deep.equal(id);
            done();
        });
        clientSocket.emit('createGame', gameSettings);
    });

    it('should throw error if game settings are invalid', (done) => {
        const gameSettings = { playerName: false, randomBonus: true, timePerTurn: 60000 };
        clientSocket.on('error', (errorContent: string) => {
            expect(errorContent).to.equal('Impossible de rejoindre la partie, les paramètres de partie sont invalides.');
            done();
        });
        clientSocket.emit('createGame', gameSettings);
    });

    it('should delete pending game if client disconnect', (done) => {
        const gameSettings = { playerName: 'name', randomBonus: true, timePerTurn: 60000 };
        clientSocket.emit('createGame', gameSettings);
        serverSocket.on('disconnect', () => {
            expect(newGameManagerService.deletePendingGame.called).to.be.true;
            done();
        });
        clientSocket.close();
    });

    it('should throw error if parameters are invalid', (done) => {
        const id = true;
        const playerName = 'abc';
        clientSocket.on('error', (errorContent: string) => {
            expect(errorContent).to.equal('Impossible de rejoindre la partie, les paramètres sont invalides.');
            done();
        });
        clientSocket.emit('joinGame', id, playerName);
    });

    it('should throw error if player try to join a game not active', (done) => {
        newGameManagerService.joinPendingGame.returns(undefined);
        const id = 'aa';
        const playerName = 'abc';
        clientSocket.on('error', (errorContent: string) => {
            expect(errorContent).to.equal("Impossible de rejoindre la partie, elle n'existe pas.");
            done();
        });
        clientSocket.emit('joinGame', id, playerName);
    });

    it('should send gameSettings to players on joinGame', (done) => {
        const gameSettingsUI = {
            playerName: 'name',
            randomBonus: true,
            timePerTurn: 60000,
            gameMode: GameMode.Classic,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        const gameSettings = {
            id: 'a',
            playerName: 'name',
            randomBonus: true,
            timePerTurn: 60000,
            gameMode: GameMode.Classic,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };

        newGameManagerService.createPendingGame.returns('a');
        newGameManagerService.joinPendingGame.returns('id');
        newGameManagerService.getPendingGame.returns(gameSettings as OnlineGameSettings);

        const clientSocket2 = Client(`http://localhost:${port}`, { path: '/newGame', multiplex: false });
        const playerName = 'abc';

        clientSocket2.on('gameJoined', (gameSettingServer: OnlineGameSettings) => {
            expect(gameSettingServer).to.deep.equal(gameSettings);
            clientSocket2.close();
            done();
        });
        clientSocket2.emit('createGame', gameSettingsUI);
        clientSocket2.on('pendingGameId', (idGame: string) => {
            clientSocket.emit('joinGame', idGame, playerName);
        });
    });
});
