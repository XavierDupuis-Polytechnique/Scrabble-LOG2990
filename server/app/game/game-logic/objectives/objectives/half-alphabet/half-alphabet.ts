import { HALF_ALPHABET_COMPLETION_PERCENTAGE, HALF_ALPHABET_POINTS, N_LETTERS_IN_ALPHABET } from '@app/constants';
import { Action } from '@app/game/game-logic/actions/action';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { JOKER_CHAR } from '@app/game/game-logic/constants';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';

export class HalfAlphabet extends Objective {
    name = "Moitié de l'alphabet";
    description = "Placer la moitié des lettres de l'alphabet";
    points = HALF_ALPHABET_POINTS;

    placedLetters = new Set<string>();

    protected updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        const lettersToPlace = params.lettersToPlace.map((letter: Letter) => letter.char);
        for (const letter of lettersToPlace) {
            if (letter === JOKER_CHAR) {
                continue;
            }
            this.placedLetters.add(letter);
        }
        const newProgression = this.placedLetters.size / N_LETTERS_IN_ALPHABET / HALF_ALPHABET_COMPLETION_PERCENTAGE;
        this.setPlayerProgression(action.player.name, newProgression);
    }
}
