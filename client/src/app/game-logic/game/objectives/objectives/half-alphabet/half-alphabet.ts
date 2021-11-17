import { Action } from '@app/game-logic/actions/action';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { N_LETTERS_IN_ALPHABET, HALF_ALPHABET_COMPLETION_PERCENTAGE as COMPLETION_PERCENTAGE } from '@app/game-logic/constants';

export class HalfAlphabet extends Objective {
    name = "Moitié de l'alphabet";
    description = "Placer la moitié des lettres de l'alphabet";

    placedLetters = new Set<string>();

    updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        const lettersToPlace = params.lettersToPlace.map((letter: Letter) => letter.char);
        for (const letter of lettersToPlace) {
            if (letter === '*') {
                continue;
            }
            this.placedLetters.add(letter);
        }
        this.progression = this.placedLetters.size / N_LETTERS_IN_ALPHABET / COMPLETION_PERCENTAGE;
    }
}
