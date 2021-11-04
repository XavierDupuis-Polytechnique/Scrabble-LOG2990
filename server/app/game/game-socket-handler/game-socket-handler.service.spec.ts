/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { GameManagerService } from '@app/game/game-manager/game-manager.services';
import { GameSocketsHandler } from '@app/game/game-socket-handler/game-socket-handler.service';
import { createSinonStubInstance, StubbedClass } from '@app/test.util';
import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
import { Socket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import * as sinon from 'sinon';
import { GameState, GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Subject } from 'rxjs';
import { TimerGameControl } from '@app/game/game-logic/timer/timer-game-control.interface';
import { UserAuth } from '@app/game/game-socket-handler/user-auth.interface';
import { expect } from 'chai';
import { OnlineAction, OnlineActionType } from '@app/game/online-action.interface';
import { TimerControls } from '@app/game/game-logic/timer/timer-controls.enum';

describe('GameSocketHandler', () => {
    let handler: GameSocketsHandler;
    let httpServer: Server;
    let clientSocket: ClientSocket;
    let serverSocket: Socket;
    let port: number;
    let sandbox: sinon.SinonSandbox;
    let stubGameManager: StubbedClass<GameManagerService>;
    const mockNewGameState$ = new Subject<GameStateToken>();
    const mockTimerControl$ = new Subject<TimerGameControl>();

    before((done) => {
        httpServer = createServer();
        httpServer.listen(() => {
            port = (httpServer.address() as AddressInfo).port;

            stubGameManager = createSinonStubInstance<GameManagerService>(GameManagerService);
            sinon.stub(stubGameManager, 'newGameState$').value(mockNewGameState$);
            sinon.stub(stubGameManager, 'timerControl$').value(mockTimerControl$);
            handler = new GameSocketsHandler(httpServer, stubGameManager);
            handler.handleSockets();
            handler.sio.on('connection', (socket) => {
                serverSocket = socket;
            });
            done();
        });
    });

    beforeEach((done) => {
        sandbox = sinon.createSandbox();
        clientSocket = Client(`http://localhost:${port}`, { path: '/game' });
        clientSocket.on('connect', done);
    });

    afterEach(() => {
        sandbox.restore();
        clientSocket.disconnect();
    });

    after(() => {
        httpServer.close();
    });

    it('should be able to join a game', (done) => {
        const userAuth: UserAuth = {
            playerName: 'test',
            gameToken: 'abc',
        };
        serverSocket.on('joinGame', (receivedUserAuth: UserAuth) => {
            expect(receivedUserAuth).to.deep.equal(userAuth);
            done();
        });

        clientSocket.emit('joinGame', userAuth);
    });

    it('should disconnect client when game manager throws', (done) => {
        const userAuth: UserAuth = {
            playerName: 'test',
            gameToken: 'abc',
        };
        serverSocket.on('joinGame', (receivedUserAuth: UserAuth) => {
            expect(receivedUserAuth).to.deep.equal(userAuth);
        });
        stubGameManager.addPlayerToGame.throws(Error);
        clientSocket.emit('joinGame', userAuth);
        clientSocket.on('disconnect', () => {
            done();
        });
    });

    it('should be able to send user action', (done) => {
        const userAction: OnlineAction = {
            type: OnlineActionType.Pass,
        };
        serverSocket.on('nextAction', (receivedUserAction: OnlineAction) => {
            expect(receivedUserAction).to.deep.equal(userAction);
            done();
        });
        clientSocket.emit('nextAction', userAction);
    });

    it('should disconnect client when there is an error on send action', (done) => {
        const userAction: OnlineAction = {
            type: OnlineActionType.Pass,
        };
        serverSocket.on('nextAction', (receivedUserAction: OnlineAction) => {
            expect(receivedUserAction).to.deep.equal(userAction);
        });
        stubGameManager.receivePlayerAction.throws(Error);
        clientSocket.emit('nextAction', userAction);
        clientSocket.on('disconnect', () => {
            done();
        });
    });

    it('should emit gamestate to client', (done) => {
        stubGameManager.addPlayerToGame.returns();
        const gameState: GameState = {
            players: [],
            activePlayerIndex: 0,
            grid: [],
            lettersRemaining: 0,
            isEndOfGame: false,
            winnerIndex: [],
        };
        const gameToken = 'abc';
        const gameStateToken: GameStateToken = {
            gameToken,
            gameState,
        };
        clientSocket.on('gameState', (receivedGameState: GameState) => {
            expect(receivedGameState).to.deep.equal(gameState);
            done();
        });

        const userAuth: UserAuth = {
            playerName: 'test',
            gameToken,
        };
        clientSocket.emit('joinGame', userAuth);
        serverSocket.on('joinGame', () => {
            mockNewGameState$.next(gameStateToken);
        });
    });

    it('should send timer controls to client', (done) => {
        stubGameManager.addPlayerToGame.returns();
        const gameToken = 'abc';
        const control: TimerControls = TimerControls.Start;
        const timerGameControl: TimerGameControl = {
            gameToken,
            control,
        };
        clientSocket.on('timerControl', (receivedtimerControl: GameState) => {
            expect(receivedtimerControl).to.deep.equal(control);
            done();
        });

        const userAuth: UserAuth = {
            playerName: 'test',
            gameToken,
        };
        clientSocket.emit('joinGame', userAuth);
        serverSocket.on('joinGame', () => {
            mockTimerControl$.next(timerGameControl);
        });
    });
});
