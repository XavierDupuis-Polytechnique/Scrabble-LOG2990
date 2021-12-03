import { PlayerProgression } from '@app/game/game-logic/interface/game-state.interface';
import { ObjectiveType } from '@app/game/game-logic/objectives/objective-creator/objective-type';
import { FourCorners } from '@app/game/game-logic/objectives/objectives/four-corners/four-corners';
import { HalfAlphabet } from '@app/game/game-logic/objectives/objectives/half-alphabet/half-alphabet';
import { NineLettersWord } from '@app/game/game-logic/objectives/objectives/nine-letters-word/nine-letters-word';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import {
    HalfAlphabetProgression,
    TenWordsProgression,
    TransitionObjectives,
} from '@app/game/game-logic/objectives/objectives/objective-converter/transition-objectives';
import { Palindrome } from '@app/game/game-logic/objectives/objectives/palindrome/palindrome';
import { SameWordTwice } from '@app/game/game-logic/objectives/objectives/same-word-twice/same-word-twice';
import { TenWords } from '@app/game/game-logic/objectives/objectives/ten-words/ten-words';
import { ThreeSameLetters } from '@app/game/game-logic/objectives/objectives/three-same-letters/three-same-letters';
import { TripleBonus } from '@app/game/game-logic/objectives/objectives/triple-bonus/triple-bonus';

export class OnlineObjectiveConverter {
    convertObjectives(publicObjectives: Objective[], privateObjectives: Map<string, Objective[]>): TransitionObjectives[] {
        return this.convertPrivate(privateObjectives).concat(this.convertPublic(publicObjectives));
    }

    private convertPublic(objectives: Objective[]): TransitionObjectives[] {
        const translatedObjectives = objectives.map((objective) => this.translateObjective(objective));
        return translatedObjectives;
    }

    private convertPrivate(privateObjectives: Map<string, Objective[]>): TransitionObjectives[] {
        const translatedObjectives: TransitionObjectives[] = [];
        privateObjectives.forEach((objectives) => {
            const objective = objectives[0];
            translatedObjectives.push(this.translateObjective(objective));
        });

        return translatedObjectives;
    }

    private translateObjective(objective: Objective): TransitionObjectives {
        const progressions: PlayerProgression[] = [];

        objective.progressions.forEach((progression: number, playerName: string) => {
            progressions.push({ playerName, progression });
        });

        const objectiveType = this.getObjectiveType(objective);
        const translatedObjective: TransitionObjectives = {
            owner: objective.owner,
            name: objective.name,
            description: objective.description,
            points: objective.points,
            objectiveType,
            progressions,
        };

        if (objective instanceof TenWords) {
            const wordCounts = (objective as TenWords).wordCounts;
            const tempWordCounts: TenWordsProgression[] = [];
            wordCounts.forEach((wordCount, playerName) => {
                tempWordCounts.push({ playerName, wordCount });
            });
            translatedObjective.wordCounts = tempWordCounts;
        }

        if (objective instanceof HalfAlphabet) {
            const letters = (objective as HalfAlphabet).placedLetters;
            const tempPlacedLetters: HalfAlphabetProgression[] = [];
            letters.forEach((placedLetters, playerName) => {
                tempPlacedLetters.push({ playerName, placedLetters: [...placedLetters] });
            });
            translatedObjective.placedLetters = tempPlacedLetters;
        }
        return translatedObjective;
    }

    private getObjectiveType(objective: Objective) {
        if (objective instanceof FourCorners) {
            return ObjectiveType.FourCorners;
        }

        if (objective instanceof TripleBonus) {
            return ObjectiveType.TripleBonus;
        }

        if (objective instanceof Palindrome) {
            return ObjectiveType.Palindrome;
        }

        if (objective instanceof TenWords) {
            return ObjectiveType.TenWords;
        }

        if (objective instanceof NineLettersWord) {
            return ObjectiveType.NineLettersWord;
        }

        if (objective instanceof HalfAlphabet) {
            return ObjectiveType.HalfAlphabet;
        }

        if (objective instanceof SameWordTwice) {
            return ObjectiveType.SameWordTwice;
        }

        if (objective instanceof ThreeSameLetters) {
            return ObjectiveType.ThreeSameLetters;
        }
        throw Error('objective not in objective type');
    }
}
