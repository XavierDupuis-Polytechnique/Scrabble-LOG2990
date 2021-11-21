import { Action } from '@app/game-logic/actions/action';
import { NINE_LETTERS_WORD_NUMBER_OF_LETTERS_REQUIRED, NINE_LETTERS_WORD_POINTS } from '@app/game-logic/constants';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

export class NineLettersWord extends Objective {
    static numberOfLettersRequired = NINE_LETTERS_WORD_NUMBER_OF_LETTERS_REQUIRED;
    name = 'Mot de 9 lettres';
    description = 'Former un mot de 9 lettres';
    points = NINE_LETTERS_WORD_POINTS;

    protected updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        for (const word of params.formedWords) {
            if (word.length === NineLettersWord.numberOfLettersRequired) {
                this.setPlayerProgression(action.player.name, 1);
                return;
            }
        }
    }
}
