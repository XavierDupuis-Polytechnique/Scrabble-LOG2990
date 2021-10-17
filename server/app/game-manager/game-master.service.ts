import { GameSettingsMulti, GameSettingsMultiUI } from '@app/game-manager/game-settings-multi.interface';
import { Service } from 'typedi';

@Service()
export class GameMasterService {
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
        // if (this.settingsIsValid(gameSetting)) {
        const gameId = this.idgenerator();
        this.pendingGames.set(gameId, gameSetting);

        // }
    }

    joinPendingGame(id: number, name: string) {
        if (this.pendingGames.has(id)) {
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
    deletePendingGame(id: number) {
        this.pendingGames.delete(id);
    }
    startGame(gameSettings: GameSettingsMulti) {
        this.deletePendingGame(gameSettings.id);
        // Start Game
    }
    idgenerator(): number {
        const toChange = 100;
        const id = Math.floor(Math.random() * toChange);
        return id;
    }

    toGameSettingsMulti(id: number, settings: GameSettingsMultiUI): GameSettingsMulti {
        const gameSettings = settings as GameSettingsMulti;
        gameSettings.id = id;
        return gameSettings;
    }

    // settingsIsValid(settings: GameSettingsMultiUI):boolean {
    //     // TODO
    // }
}
