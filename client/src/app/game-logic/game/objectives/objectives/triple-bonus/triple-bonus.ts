import { Action } from '@app/game-logic/actions/action';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

export class TripleBonus extends Objective {
    name = 'Les 3 mousquetaires';
    description = 'Faire un placement en utilisant 3 cases bonus';

    protected updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        throw new Error('Method not implemented.');
    }
}
