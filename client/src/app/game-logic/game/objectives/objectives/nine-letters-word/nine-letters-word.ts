import { Action } from '@app/game-logic/actions/action';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

export class NineLettersWord extends Objective {
    name = 'Mot de 9 lettres';
    description = 'Former un mot de 9 lettres';

    updateProgression(action: Action, params:  ObjectiveUpdateParams): void {
        throw new Error('Method not implemented.');
    }
}
