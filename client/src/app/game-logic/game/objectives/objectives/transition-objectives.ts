import { LightObjective } from '@app/game-logic/game/games/online-game/game-state';
import { ObjectiveType } from '@app/game-logic/game/objectives/objective-creator/objective-type';

export interface TransitionObjectives extends LightObjective {
    placedLetters?: HalfAlphabetProgression[];
    objectiveType: ObjectiveType;
}

export interface HalfAlphabetProgression {
    playerName: string;
    placedLetters: string[];
}
