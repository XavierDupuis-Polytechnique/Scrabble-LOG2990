import { GameState, GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { TimerControls } from '@app/game/game-logic/timer/timer-controls.enum';
import { TimerGameControl } from '@app/game/game-logic/timer/timer-game-control.interface';
import { GameManagerService } from '@app/game/game-manager/game-manager.services';
import { OnlineAction } from '@app/game/online-action.interface';
import * as http from 'http';
import * as io from 'socket.io';
import { UserAuth } from './user-auth.interface';

export class GameSocketsHandler {
    readonly sio: io.Server;
    constructor(server: http.Server, private gameManager: GameManagerService) {
        this.sio = new io.Server(server, {
            path: '/game',
            cors: { origin: '*', methods: ['GET', 'POST'] },
            // TODO : forfeit after 5 second timeout
            pingTimeout: 5000,
        });
        this.gameManager.newGameStates$.subscribe((gameStateToken: GameStateToken) => {
            const gameToken = gameStateToken.gameToken;
            const gameState = gameStateToken.gameState;
            this.emitGameState(gameState, gameToken);
        });

        this.gameManager.timerControls$.subscribe((timerGameControl: TimerGameControl) => {
            const gameToken = timerGameControl.gameToken;
            const timerControl = timerGameControl.control;
            this.emitTimerControl(timerControl, gameToken);
        });
    }

    handleSockets() {
        this.sio.on('connection', (socket) => {
            socket.on('joinGame', (userAuth: UserAuth) => {
                try {
                    const gameToken = userAuth.gameToken;
                    socket.join(gameToken);
                    this.addPlayerToGame(socket.id, userAuth);
                } catch (e) {
                    socket.disconnect();
                }
            });

            socket.on('nextAction', (action: OnlineAction) => {
                try {
                    this.sendPlayerAction(socket.id, action);
                } catch (e) {
                    socket.disconnect();
                }
            });

            socket.on('disconnect', () => {
                this.removePlayer(socket.id);
            });
        });
    }

    private emitTimerControl(timerControl: TimerControls, gameToken: string) {
        this.sio.to(gameToken).emit('timerControl', timerControl);
    }

    private emitGameState(gameState: GameState, gameToken: string) {
        // TODO? : get game state
        this.sio.to(gameToken).emit('gameState', gameState);
    }

    private addPlayerToGame(socketId: string, userAuth: UserAuth) {
        const playerId = socketId;
        this.gameManager.addPlayerToGame(playerId, userAuth);
    }

    private sendPlayerAction(socketId: string, action: OnlineAction) {
        const playerId = socketId;
        this.gameManager.receivePlayerAction(playerId, action);
    }

    private removePlayer(playerId: string) {
        this.gameManager.removePlayerFromGame(playerId);
    }
}
