import { OnlineGameSettingsUI } from '@app/game-manager/game-settings-multi.interface';
import { NewOnlineGameService } from '@app/game-manager/new-online-game.service';
import * as http from 'http';
import { Server } from 'socket.io';

const pendingGames = 'pendingGames';
const createGame = 'createGame';
const joinGame = 'joinGame';
const gameJoined = 'gameJoined';
const pendingGameId = 'pendingGameId';

export class NewOnlineGameSocketHandler {
    private ioServer: Server;

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
            // socket.sendBuffer = [];
            socket.emit(pendingGames, this.newOnlineGameService.getPendingGames());

            socket.on(createGame, (gameSetting: OnlineGameSettingsUI) => {
                if (this.isGameSettings(gameSetting)) {
                    gameId = this.newOnlineGameService.createPendingGame(gameSetting);
                    socket.emit(pendingGameId, gameId);
                    socket.join(gameId);
                    this.emitPendingGamesToAll();
                    console.log(gameSetting.playerName, 'created a new game (id:', gameId, ')');
                } // TODO: throw Error
            });

            socket.on(joinGame, (id: string, name: string) => {
                console.log(name, 'joined game', id);
                if (typeof id === 'string' && typeof name === 'string') {
                    const gameToken = this.newOnlineGameService.joinPendingGame(id, name);
                    if (gameToken !== undefined) {
                        gameId = id;
                        socket.join(gameId);
                        this.sendGameToken(gameId, gameToken);
                        this.emitPendingGamesToAll();
                    }
                }
            });

            socket.on('disconnect', () => {
                console.log('Disconnected: ', socket.id);
                if (gameId === undefined) {
                    return;
                }
                this.newOnlineGameService.deletePendingGame(gameId);
                this.emitPendingGamesToAll();
            });
        });
    }
    // private createGame(gameSetting: OnlineGameSettingsUI) {
    //     if (this.isGameSettings(gameSetting)) {
    //         gameId = this.newOnlineGameService.createPendingGame(gameSetting);
    //         socket.emit(pendingGameId, gameId);
    //         socket.join(gameId);
    //         this.emitPendingGamesToAll();
    //         console.log(gameSetting.playerName, 'created a new game (id:', gameId, ')');
    //     }
    // }
    private sendGameToken(gameId: string, gameToken: string) {
        this.ioServer.sockets.to(gameId).emit(gameJoined, gameToken);
    }

    private emitPendingGamesToAll() {
        this.ioServer.sockets.emit(pendingGames, this.newOnlineGameService.getPendingGames());
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
