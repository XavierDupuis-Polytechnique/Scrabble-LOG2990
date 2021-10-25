import { OnlineGameSettings, OnlineGameSettingsUI } from '@app/game-manager/game-settings-multi.interface';
import { GameMaster } from '@app/game-master/game-master.service';
import { Service } from 'typedi';

@Service()
export class NewOnlineGameService {
    pendingGames: Map<string, OnlineGameSettingsUI> = new Map<string, OnlineGameSettingsUI>();
    constructor(private gameMaster: GameMaster) {}

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

    private toOnlineGameSettings(id: string, settings: OnlineGameSettingsUI): OnlineGameSettings {
        const gameSettings = settings as OnlineGameSettings;
        gameSettings.id = id;
        return gameSettings;
    }
}
