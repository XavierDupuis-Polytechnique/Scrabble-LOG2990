import { Action } from '@app/game-logic/actions/action';
import { Game } from '@app/game-logic/game/games/game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class ThreeSameLetters extends Objective {
    name = 'La triforce';
    description = 'Former un mot avec 3 fois la même lettre';

    update(action: Action, game: Game): void {
        throw new Error('Method not implemented.');
    }
}
