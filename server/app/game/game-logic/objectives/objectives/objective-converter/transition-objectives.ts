import { LightObjective } from '@app/game/game-logic/interface/game-state.interface';
import { ObjectiveType } from '@app/game/game-logic/objectives/objective-creator/objective-type';

export interface TransitionObjectives extends LightObjective {
    placedLetters?: HalfAlphabetProgression[];
    objectiveType: ObjectiveType;
}

export interface HalfAlphabetProgression {
    playerName: string;
    placedLetters: string[];
}
