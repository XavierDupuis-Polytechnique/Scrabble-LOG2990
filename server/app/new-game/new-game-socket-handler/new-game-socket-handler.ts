import { isGameSettings } from '@app/game/game-logic/utils';
import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { NewGameManagerService } from '@app/new-game/new-game-manager/new-game-manager.service';
import { OnlineGameSettings, OnlineGameSettingsUI } from '@app/new-game/online-game.interface';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const pendingGames = 'pendingGames';
const createGame = 'createGame';
const joinGame = 'joinGame';
const gameJoined = 'gameJoined';
const pendingGameId = 'pendingGameId';

export class NewGameSocketHandler {
    readonly ioServer: Server;

    constructor(server: http.Server, private newGameManagerService: NewGameManagerService, private dictionaryService: DictionaryService) {
        this.ioServer = new Server(server, {
            path: '/newGame',
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });
    }

    newGameHandler(): void {
        this.ioServer.on('connection', (socket) => {
            let gameId: string;

            socket.emit(pendingGames, this.newGameManagerService.getPendingGames());

            socket.on(createGame, (gameSettings: OnlineGameSettingsUI) => {
                try {
                    gameId = this.createGame(gameSettings, socket);
                    this.dictionaryService.makeGameDictionary(gameId, gameSettings.dictTitle);
                    this.emitPendingGamesToAll();
                } catch (e) {
                    this.sendError(e, socket);
                }
            });

            socket.on(joinGame, (id: string, name: string) => {
                try {
                    this.joinGame(id, name, this.getPendingGame(id), socket);
                    this.emitPendingGamesToAll();
                } catch (e) {
                    this.sendError(e, socket);
                }
            });

            socket.on('disconnect', () => {
                this.onDisconnect(gameId);
                this.emitPendingGamesToAll();
            });
        });
    }

    private createGame(gameSettings: OnlineGameSettingsUI, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): string {
        if (!isGameSettings(gameSettings)) {
            throw Error('Impossible de rejoindre la partie, les paramètres de partie sont invalides.');
        }
        const gameId = this.newGameManagerService.createPendingGame(gameSettings);
        socket.emit(pendingGameId, gameId);
        socket.join(gameId);
        return gameId;
    }

    private joinGame(
        id: string,
        name: string,
        gameSettings: OnlineGameSettings,
        socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    ) {
        if (typeof id !== 'string' || typeof name !== 'string') {
            throw Error('Impossible de rejoindre la partie, les paramètres sont invalides.');
        }
        const gameToken = this.newGameManagerService.joinPendingGame(id, name);
        if (!gameToken) {
            throw Error("Impossible de rejoindre la partie, elle n'existe pas.");
        }
        socket.join(id);
        this.sendGameSettingsToPlayers(id, gameToken, gameSettings);
    }

    private getPendingGame(id: string): OnlineGameSettings {
        return this.newGameManagerService.getPendingGame(id);
    }
    private onDisconnect(gameId: string) {
        if (!gameId) {
            return;
        }
        this.newGameManagerService.deletePendingGame(gameId);
    }

    private sendError(error: Error, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
        const errorMessage = error.message;
        socket.emit('error', errorMessage);
    }

    private sendGameSettingsToPlayers(gameId: string, gameToken: string, gameSettings: OnlineGameSettings) {
        gameSettings.id = gameToken;
        this.ioServer.to(gameId).emit(gameJoined, gameSettings);
    }

    private emitPendingGamesToAll() {
        this.ioServer.emit(pendingGames, this.newGameManagerService.getPendingGames());
    }
}
