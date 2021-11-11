import { Game } from '@app/game-logic/game/games/game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class FourCorners extends Objective {
    name = 'Quatre Coins';
    description = 'Être le joueur à remplir le 4e coin de la planche de jeu';

    update(game: Game): void {
        throw new Error('Method not implemented.');
    }
}
