import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { GameManagerService } from '@app/game/game-manager/game-manager.services';
import { OnlineGameSettings, OnlineGameSettingsUI } from '@app/new-game/online-game.interface';
import { Service } from 'typedi';

@Service()
export class NewGameManagerService {
    static gameIdCounter: number = 0;
    pendingGames: Map<string, OnlineGameSettingsUI> = new Map<string, OnlineGameSettingsUI>();

    constructor(private gameMaster: GameManagerService, private dictionaryService: DictionaryService) {}

    getPendingGames(): OnlineGameSettings[] {
        const games: OnlineGameSettings[] = [];
        this.pendingGames.forEach((game, id) => {
            games.push(this.toOnlineGameSettings(id, game));
        });
        return games;
    }

    createPendingGame(gameSetting: OnlineGameSettingsUI): string {
        const gameId = this.generateId();
        this.pendingGames.set(gameId, gameSetting);
        return gameId;
    }

    joinPendingGame(id: string, name: string): string | undefined {
        if (!this.isPendingGame(id)) {
            return;
        }
        const gameSettings = this.pendingGames.get(id);
        if (!gameSettings) {
            return;
        }
        if (gameSettings.opponentName) {
            return;
        }
        gameSettings.opponentName = name;
        const onlineGameSettingsUI = this.toOnlineGameSettings(id, gameSettings);
        const gameToken = this.generateGameToken(onlineGameSettingsUI);
        this.startGame(gameToken, this.toOnlineGameSettings(id, onlineGameSettingsUI));
        return id;
    }

    deletePendingGame(id: string) {
        const gameStarted = this.gameMaster.activeGames.has(id);
        if (!gameStarted) {
            this.dictionaryService.deleteGameDictionary(id);
        }
        this.pendingGames.delete(id);
    }

    getPendingGame(id: string): OnlineGameSettings {
        if (!this.pendingGames.get(id)) {
            throw Error('This game does not exist.');
        }
        const onlineGameSetting = this.toOnlineGameSettings(id, this.pendingGames.get(id));
        return onlineGameSetting;
    }

    private isPendingGame(id: string): boolean {
        return this.pendingGames.has(id);
    }

    private startGame(gameToken: string, gameSettings: OnlineGameSettings) {
        this.gameMaster.createGame(gameToken, gameSettings);
        this.deletePendingGame(gameSettings.id);
    }

    private generateId(): string {
        const gameId = NewGameManagerService.gameIdCounter.toString();
        NewGameManagerService.gameIdCounter = (NewGameManagerService.gameIdCounter + 1) % Number.MAX_SAFE_INTEGER;
        return gameId;
    }

    private generateGameToken(gameSetting: OnlineGameSettings): string {
        return gameSetting.id;
    }

    private toOnlineGameSettings(id: string, settings: OnlineGameSettingsUI | undefined): OnlineGameSettings {
        const gameSettings = settings as OnlineGameSettings;
        gameSettings.id = id;
        return gameSettings;
    }
}
