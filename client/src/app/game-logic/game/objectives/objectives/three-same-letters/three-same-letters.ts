import { Action } from '@app/game-logic/actions/action';
import { THREE_SAME_LETTERS_NUMBER_OF_OCCURENCES, THREE_SAME_LETTERS_POINTS } from '@app/game-logic/constants';
import { Tile } from '@app/game-logic/game/board/tile';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

export class ThreeSameLetters extends Objective {
    name = 'La triforce';
    description = 'Former un mot avec 3 fois la même lettre';
    points = THREE_SAME_LETTERS_POINTS;

    protected updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        for (const word of params.formedWords) {
            if (this.hasThreeSameLetters(word)) {
                this.setPlayerProgression(action.player.name, 1);
                return;
            }
        }
    }

    private hasThreeSameLetters(word: Tile[]): boolean {
        const letterMap = new Map<string, number>();
        for (const letter of word) {
            const char = letter.letterObject.char.toUpperCase();
            let occurence = letterMap.get(char);
            if (occurence === undefined) {
                letterMap.set(char, 1);
            } else {
                letterMap.set(char, ++occurence);
                if (occurence === THREE_SAME_LETTERS_NUMBER_OF_OCCURENCES) {
                    return true;
                }
            }
        }
        return false;
    }
}
