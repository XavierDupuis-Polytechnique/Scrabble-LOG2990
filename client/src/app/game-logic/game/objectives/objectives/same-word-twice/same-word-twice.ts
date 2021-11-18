import { Action } from '@app/game-logic/actions/action';
import { SAME_WORD_TWICE_POINTS } from '@app/game-logic/constants';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { stringifyWord } from '@app/game-logic/utils';

export class SameWordTwice extends Objective {
    name = "1 c'est bien mais 2 c'est mieux";
    description = 'Former deux fois le même mot dans un même placement';
    points = SAME_WORD_TWICE_POINTS;

    protected updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        this.setPlayerProgression(action.player.name, 0);
        const formedWords: string[] = params.formedWords.map((word) => stringifyWord(word));
        const wordSet = new Set<string>();
        for (const word of formedWords) {
            if (wordSet.has(word)) {
                this.setPlayerProgression(action.player.name, 1);
                return;
            }
            wordSet.add(word);
        }
    }
}
