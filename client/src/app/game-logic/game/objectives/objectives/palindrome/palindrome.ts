import { Action } from '@app/game-logic/actions/action';
import { Tile } from '@app/game-logic/game/board/tile';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { isPalindrome, stringifyWord } from '@app/game-logic/utils';

export class Palindrome extends Objective {
    name = 'Engage le jeu, que je le gagne';
    description = 'Former un palindrome';

    updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        const formedWords: string[] = params.formedWords.map((word: Tile[]) => stringifyWord(word));
        for (const word of formedWords) {
            if (isPalindrome(word)) {
                this.progression = 1;
            }
        }
    }
}
