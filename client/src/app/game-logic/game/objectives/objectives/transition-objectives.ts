import { LightObjective } from '@app/game-logic/game/games/online-game/game-state';
import { ObjectiveType } from '@app/game-logic/game/objectives/objective-creator/objective-type';

export interface TransitionObjective extends LightObjective {
    placedLetters?: HalfAlphabetProgression[];
    wordCounts?: TenWordsProgression[];
    objectiveType: ObjectiveType;
}

export interface HalfAlphabetProgression {
    playerName: string;
    placedLetters: string[];
}

export interface TenWordsProgression {
    playerName: string;
    wordCount: number;
}
