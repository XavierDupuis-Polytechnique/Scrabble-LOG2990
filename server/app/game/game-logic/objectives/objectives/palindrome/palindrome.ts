import { PALINDROME_POINTS } from '@app/constants';
import { Action } from '@app/game/game-logic/actions/action';
import { Tile } from '@app/game/game-logic/board/tile';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { isPalindrome, stringifyWord } from '@app/game/game-logic/utils';

export class Palindrome extends Objective {
    name = 'Engage le jeu, que je le gagne';
    description = 'Former un palindrome';
    points = PALINDROME_POINTS;

    protected updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        const formedWords: string[] = params.formedWords.map((word: Tile[]) => stringifyWord(word));
        for (const word of formedWords) {
            if (isPalindrome(word)) {
                this.setPlayerProgression(action.player.name, 1);
            }
        }
    }
}
