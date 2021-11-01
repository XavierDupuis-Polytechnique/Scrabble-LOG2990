import { OnlineGameSettingsUI } from '@app/game-manager/game-settings-multi.interface';
import { NewOnlineGameService } from '@app/game-manager/new-online-game.service';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const pendingGames = 'pendingGames';
const createGame = 'createGame';
const joinGame = 'joinGame';
const gameJoined = 'gameJoined';
const pendingGameId = 'pendingGameId';
const disconnect = 'disconnect';

export class NewOnlineGameSocketHandler {
    readonly ioServer: Server;

    constructor(server: http.Server, private newOnlineGameService: NewOnlineGameService) {
        this.ioServer = new Server(server, {
            path: '/newGame',
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });
    }

    newGameHandler(): void {
        this.ioServer.on('connection', (socket) => {
            console.log('Connected: ', socket.id);

            let gameId: string;

            socket.emit(pendingGames, this.newOnlineGameService.getPendingGames());

            socket.on(createGame, (gameSettings: OnlineGameSettingsUI) => {
                try {
                    gameId = this.createGame(gameSettings, socket);
                    this.emitPendingGamesToAll();
                    console.log(gameSettings.playerName, 'created a new game (id:', gameId, ')');
                } catch (e) {
                    this.sendError(e, socket);
                }
            });

            socket.on(joinGame, (id: string, name: string) => {
                try {
                    this.joinGame(id, name, socket);
                    this.emitPendingGamesToAll();
                    console.log(name, 'joined game', id);
                } catch (e) {
                    this.sendError(e, socket);
                }
            });

            socket.on(disconnect, () => {
                this.onDisconnect(gameId);
                socket.emit(disconnect);
                this.emitPendingGamesToAll();
                console.log('Disconnected: ', socket.id);
            });
        });
    }

    private createGame(gameSettings: OnlineGameSettingsUI, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): string {
        if (!this.isGameSettings(gameSettings)) {
            throw Error('Cannot create game, invalid GameSettings');
        }
        const gameId = this.newOnlineGameService.createPendingGame(gameSettings);
        socket.emit(pendingGameId, gameId);
        socket.join(gameId);
        return gameId;
    }

    private joinGame(id: string, name: string, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
        if (typeof id !== 'string' && typeof name !== 'string') {
            throw Error('Cannot join game, invalid GameSettings');
        }
        const gameToken = this.newOnlineGameService.joinPendingGame(id, name);
        if (gameToken === undefined) {
            throw Error('Cannot join game, game does not exist anymore');
        }
        socket.join(id);
        this.sendGameTokenToPlayers(id, gameToken);
    }

    private onDisconnect(gameId: string) {
        if (gameId === undefined) {
            return;
        }
        this.newOnlineGameService.deletePendingGame(gameId);
    }

    private sendError(error: Error, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
        const errorMessage = error.message;
        socket.emit('error', errorMessage);
        console.log(errorMessage);
    }

    private sendGameTokenToPlayers(gameId: string, gameToken: string) {
        this.ioServer.to(gameId).emit(gameJoined, gameToken);
        console.log('gametoken: ', gameToken);
    }

    private emitPendingGamesToAll() {
        this.ioServer.emit(pendingGames, this.newOnlineGameService.getPendingGames());
    }

    // TODO mettre dans un fichier UTIls
    private isGameSettings(obj: unknown): obj is OnlineGameSettingsUI {
        return (
            (obj as OnlineGameSettingsUI).playerName !== undefined &&
            typeof (obj as OnlineGameSettingsUI).playerName === 'string' &&
            (obj as OnlineGameSettingsUI).opponentName === undefined &&
            (obj as OnlineGameSettingsUI).randomBonus !== undefined &&
            typeof (obj as OnlineGameSettingsUI).randomBonus === 'boolean' &&
            (obj as OnlineGameSettingsUI).timePerTurn !== undefined &&
            typeof (obj as OnlineGameSettingsUI).timePerTurn === 'number'
        );
    }
}
