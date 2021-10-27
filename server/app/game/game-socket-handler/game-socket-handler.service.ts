import { GameManagerService } from '@app/game/game-manager/game-manager.services';
import { OnlineAction } from '@app/game/online-action.interface';
import * as http from 'http';
import * as io from 'socket.io';

export class GameSocketsHandler {
    readonly sio: io.Server;
    constructor(server: http.Server, private gameManager: GameManagerService) {
        this.sio = new io.Server(server, {
            path: '/game',
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });
        this.gameManager.newGameStates$.subscribe((state: string) => {
            // TODO get game token
            const gameToken = 'to change';
            this.emitGameState(state, gameToken);
        });
    }

    handleSockets() {
        this.sio.on('connection', (socket) => {
            console.log('Connected');
            socket.on('joinGame', (gameToken: string) => {
                try {
                    this.addPlayerToGame(socket.id, gameToken);
                    socket.join(gameToken);
                } catch (e) {
                    console.error(e);
                    socket.disconnect();
                }
            });

            socket.on('nextAction', (action: OnlineAction) => {
                try {
                    this.sendPlayerAction(socket.id, action);
                } catch (e) {
                    console.error(e);
                    socket.disconnect();
                }
            });

            socket.on('disconnect', () => {
                console.log('disconnect');
                this.removePlayer(socket.id);
            });
        });
    }

    private emitGameState(gameState: unknown, gameToken: string) {
        // get game state
        this.sio.to(gameToken).emit('gameState', gameState);
    }

    private addPlayerToGame(socketId: string, gameToken: string) {
        const playerId = socketId;
        this.gameManager.addPlayerToGame(playerId, gameToken);
    }

    private sendPlayerAction(socketId: string, action: OnlineAction) {
        const playerId = socketId;
        this.gameManager.receivePlayerAction(playerId, action);
        console.log('PLayer action');
    }

    private removePlayer(playerId: string) {
        this.gameManager.removePlayerFromGame(playerId);
    }
}
