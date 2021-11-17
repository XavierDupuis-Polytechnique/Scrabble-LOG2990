import { Action } from '@app/game-logic/actions/action';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

export class SameWordTwice extends Objective {
    name = "1 c'est bien mais 2 c'est mieux";
    description = 'Former deux fois le même mot dans un même placement';

    updateProgression(action: Action, params:  ObjectiveUpdateParams): void {
        throw new Error('Method not implemented.');
    }
}
