import { Action } from '@app/game-logic/actions/action';
import { Game } from '@app/game-logic/game/games/game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class TripleBonus extends Objective {
    name = 'Les 3 mousquetaires';
    description = 'Faire un placement en utilisant 3 cases bonus';

    update(action: Action, game: Game): void {
        throw new Error('Method not implemented.');
    }
}
