import { Action } from '@app/game-logic/actions/action';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

export const N_WORD_TO_PLACE = 10;
export class TenWords extends Objective {
    name = '10 mots';
    description = 'Placer au moins 10 mots dans une partie.';
    private wordCount = 0;

    // eslint-disable-next-line no-unused-vars
    updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        this.wordCount++;
        this.progression = this.wordCount / N_WORD_TO_PLACE;
    }
}
