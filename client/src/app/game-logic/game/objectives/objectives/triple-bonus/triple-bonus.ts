import { Action } from '@app/game-logic/actions/action';
import { TRIPLE_BONUS_POINTS } from '@app/game-logic/constants';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

export class TripleBonus extends Objective {
    name = 'Les 3 mousquetaires';
    description = 'Faire un placement en utilisant 3 cases bonus';
    points = TRIPLE_BONUS_POINTS;

    protected updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        throw new Error('Method not implemented.');
    }
}
