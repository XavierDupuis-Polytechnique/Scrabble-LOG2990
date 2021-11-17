import { Action } from '@app/game-logic/actions/action';
import { Board } from '@app/game-logic/game/board/board';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class TripleBonus extends Objective {
    name = 'Les 3 mousquetaires';
    description = 'Faire un placement en utilisant 3 cases bonus';

    updateProgression(action: Action, boardBefore: Board, boardAfter: Board): void {
        throw new Error('Method not implemented.');
    }
}
