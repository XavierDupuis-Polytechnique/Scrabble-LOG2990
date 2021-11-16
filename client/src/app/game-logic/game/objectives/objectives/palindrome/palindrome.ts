import { Action } from '@app/game-logic/actions/action';
import { Game } from '@app/game-logic/game/games/game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class Palindrome extends Objective {
    name = 'Engage le jeu, que je le gagne';
    description = 'Former un palindrome';

    update(action: Action, game: Game): void {
        throw new Error('Method not implemented.');
    }
}
