import { GameSettingsMultiUI } from '@app/game-manager/game-settings-multi.interface';
import { NewOnlineGameService } from '@app/game-manager/new-online-game.service';
import * as http from 'http';
import { Server } from 'socket.io';

const showPendingGames = 'showPendingGames';
const createGame = 'createGame';
const joinGame = 'joinGame';
export class NewOnlineGameManager {
    private ioServer: Server;

    constructor(server: http.Server, private newOnlineGameService: NewOnlineGameService) {
        this.ioServer = new Server(server, {
            path: '/newGame',
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });
    }

    newGameHandler(): void {
        this.ioServer.on('connection', (socket) => {
            socket.emit(showPendingGames, this.newOnlineGameService.getPendingGames());

            socket.on(createGame, (gameSetting: GameSettingsMultiUI) => {
                if (this.isGameSettings(gameSetting)) {
                    this.newOnlineGameService.createPendingGame(gameSetting);
                    this.emitPendingGamesToAll();
                }
                // TODO: throw Error
            });

            socket.on(joinGame, (id: number, name: string) => {
                if (typeof id === 'number' && typeof name === 'string') {
                    if (this.newOnlineGameService.isPendingGame(id)) {
                        this.newOnlineGameService.joinPendingGame(id, name);
                        this.emitPendingGamesToAll();
                    }
                }
            });
        });
    }

    emitPendingGamesToAll() {
        this.ioServer.sockets.emit(showPendingGames, this.newOnlineGameService.getPendingGames());
    }

    private isGameSettings(obj: unknown): obj is GameSettingsMultiUI {
        return (
            (obj as GameSettingsMultiUI).playerName !== undefined &&
            typeof (obj as GameSettingsMultiUI).playerName === 'string' &&
            (obj as GameSettingsMultiUI).opponentName === undefined &&
            (obj as GameSettingsMultiUI).randomBonus !== undefined &&
            typeof (obj as GameSettingsMultiUI).randomBonus === 'boolean' &&
            (obj as GameSettingsMultiUI).timePerTurn !== undefined &&
            typeof (obj as GameSettingsMultiUI).timePerTurn === 'number'
        );
    }
}
