import { TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE } from '@app/game-logic/constants';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
export class TenWords extends Objective {
    name = '10 mots';
    description = 'Placer au moins 10 mots dans une partie.';
    private wordCount = 0;

    protected updateProgression(): void {
        this.wordCount++;
        this.progression = this.wordCount / TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE;
    }
}
