import { GameSettingsMulti, GameSettingsMultiUI } from '@app/game-manager/game-settings-multi.interface';
import { GameMaster } from '@app/game-master/game-master.service';
import { Service } from 'typedi';

@Service()
export class NewOnlineGameService {
    pendingGames: Map<number, GameSettingsMultiUI> = new Map<number, GameSettingsMultiUI>();
    constructor(private gameMaster: GameMaster) {}

    getPendingGames(): GameSettingsMulti[] {
        const games: GameSettingsMulti[] = [];
        this.pendingGames.forEach((game, id) => {
            games.push(this.toGameSettingsMulti(id, game));
        });
        return games;
    }
    createPendingGame(gameSetting: GameSettingsMultiUI): number {
        const gameId = this.generateId();
        this.pendingGames.set(gameId, gameSetting);
        return gameId;
    }

    joinPendingGame(id: number, name: string): number | undefined {
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
        const onlineGameSettings = this.toGameSettingsMulti(id, gameSettings);
        const gameToken = this.generateGameToken(onlineGameSettings);
        this.startGame(gameToken, this.toGameSettingsMulti(id, onlineGameSettings));
        return id;
    }

    isPendingGame(id: number): boolean {
        return this.pendingGames.has(id);
    }

    private deletePendingGame(id: number) {
        this.pendingGames.delete(id);
    }

    private startGame(gameToken: string, gameSettings: GameSettingsMulti) {
        this.deletePendingGame(gameSettings.id);
        this.gameMaster.createGame(gameToken, gameSettings);
    }

    private generateId(): number {
        const toChange = 100;
        const id = Math.floor(Math.random() * toChange);
        return id;
    }
    private generateGameToken(gameSetting: GameSettingsMulti): string {
        return gameSetting.id.toString();
    }
    private toGameSettingsMulti(id: number, settings: GameSettingsMultiUI): GameSettingsMulti {
        const gameSettings = settings as GameSettingsMulti;
        gameSettings.id = id;
        return gameSettings;
    }
}
