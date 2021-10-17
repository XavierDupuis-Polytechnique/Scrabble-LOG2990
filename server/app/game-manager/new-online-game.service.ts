import { GameSettingsMulti, GameSettingsMultiUI } from '@app/game-manager/game-settings-multi.interface';
import { Service } from 'typedi';

@Service()
export class NewOnlineGameService {
    pendingGames: Map<number, GameSettingsMultiUI> = new Map<number, GameSettingsMultiUI>();
    // constructor() {}

    getPendingGames(): GameSettingsMulti[] {
        const games: GameSettingsMulti[] = [];
        this.pendingGames.forEach((game, id) => {
            games.push(this.toGameSettingsMulti(id, game));
        });
        return games;
    }
    createPendingGame(gameSetting: GameSettingsMultiUI) {
        const gameId = this.idgenerator();
        this.pendingGames.set(gameId, gameSetting);
    }

    joinPendingGame(id: number, name: string) {
        if (this.isPendingGame(id)) {
            const game = this.pendingGames.get(id);
            if (!game) {
                throw Error("The game you're trying to join doesn't exist.");
            }
            if (game.opponentName !== undefined) {
                throw Error('This game already has a second player.');
            }
            game.opponentName = name;

            this.startGame(this.toGameSettingsMulti(id, game));
        }
    }

    isPendingGame(id: number): boolean {
        return this.pendingGames.has(id);
    }

    private deletePendingGame(id: number) {
        this.pendingGames.delete(id);
    }

    private startGame(gameSettings: GameSettingsMulti) {
        this.deletePendingGame(gameSettings.id);
        //this.gameMaster.createGame(token)
        // Start Game
    }

    private idgenerator(): number {
        const toChange = 100;
        const id = Math.floor(Math.random() * toChange);
        return id;
    }

    private toGameSettingsMulti(id: number, settings: GameSettingsMultiUI): GameSettingsMulti {
        const gameSettings = settings as GameSettingsMulti;
        gameSettings.id = id;
        return gameSettings;
    }
}
