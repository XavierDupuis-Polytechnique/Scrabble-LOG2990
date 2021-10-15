import { GameSettingsMulti, GameSettingsMultiUI } from '@app/game-manager/game-settings-multi.interface';
import { Service } from 'typedi';

@Service()
export class GameMasterService {
    pendingGames: Map<number, GameSettingsMultiUI> = new Map<number, GameSettingsMultiUI>();
    // constructor() {}

    createPendingGame(gameSetting: GameSettingsMultiUI) {
        // if (this.settingsIsValid(gameSetting)) {
        const gameId = this.idgenerator();
        this.pendingGames.set(gameId, gameSetting);
        console.log('addGame', gameId);
        // }
    }

    joinPendingGame(id: number, name: string) {
        if (this.pendingGames.has(id)) {
            const game = this.pendingGames.get(id);
            if (!game) {
                throw Error("The game you're trying to join doesn't exist.");
            }
            if (game.opponentName !== '') {
                throw Error('This game already has a second player.');
            }
            game.opponentName = name;
            this.startGame({
                id,
                timePerTurn: game.timePerTurn,
                playerName: game.playerName,
                opponentName: game.opponentName,
                randomBonus: game.randomBonus,
            });
        }

        console.log(this.pendingGames);
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

    // settingsIsValid(settings: GameSettingsMultiUI):boolean {
    //     // TODO
    // }
}
