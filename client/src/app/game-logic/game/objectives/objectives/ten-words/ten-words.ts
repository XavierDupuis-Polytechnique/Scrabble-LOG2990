import { Action } from '@app/game-logic/actions/action';
import { TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE, TEN_WORDS_POINTS } from '@app/game-logic/constants';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
export class TenWords extends Objective {
    name = '10 mots';
    description = 'Placer au moins 10 mots dans une partie.';
    points = TEN_WORDS_POINTS;
    wordCounts = new Map<string, number>();

    protected updateProgression(action: Action): void {
        let wordCount = this.wordCounts.get(action.player.name);
        if (wordCount === undefined) {
            wordCount = 0;
        }
        wordCount++;
        this.wordCounts.set(action.player.name, wordCount);
        const newProgression = wordCount / TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE;
        this.setPlayerProgression(action.player.name, newProgression);
    }
}
