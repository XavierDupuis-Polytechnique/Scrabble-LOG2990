import { GameManagerService } from '@app/game/game-manager/game-manager.services';
import { OnlineGameSettings, OnlineGameSettingsUI } from '@app/online-game-init/game-settings-multi.interface';
import { Service } from 'typedi';

@Service()
export class NewOnlineGameService {
    pendingGames: Map<string, OnlineGameSettingsUI> = new Map<string, OnlineGameSettingsUI>();
    constructor(private gameMaster: GameManagerService) {}

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
            return undefined;
        }
        const gameSettings = this.pendingGames.get(id);
        if (!gameSettings) {
            throw Error("The game you're trying to join doesn't exist.");
        }
        if (gameSettings.opponentName !== undefined) {
            throw Error('This game already has a second player.');
        }
        gameSettings.opponentName = name;
        const onlineGameSettingsUI = this.toOnlineGameSettings(id, gameSettings);
        const gameToken = this.generateGameToken(onlineGameSettingsUI);
        this.startGame(gameToken, this.toOnlineGameSettings(id, onlineGameSettingsUI));
        return id;
    }

    isPendingGame(id: string): boolean {
        return this.pendingGames.has(id);
    }

    deletePendingGame(id: string) {
        this.pendingGames.delete(id);
    }

    getPendingGame(id: string): OnlineGameSettings {
        if (!this.pendingGames.get(id)) {
            throw Error('This game does not exist.');
        }
        const onlineGameSetting = this.toOnlineGameSettings(id, this.pendingGames.get(id));
        return onlineGameSetting;
    }

    private startGame(gameToken: string, gameSettings: OnlineGameSettings) {
        this.deletePendingGame(gameSettings.id);
        this.gameMaster.createGame(gameToken, gameSettings);
    }

    private generateId(): string {
        const toChange = 100;
        const id = Math.floor(Math.random() * toChange);
        return id.toString();
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
