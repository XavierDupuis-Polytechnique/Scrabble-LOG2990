import { PlayerProgression } from '@app/game/game-logic/interface/game-state.interface';
import { ObjectiveType } from '@app/game/game-logic/objectives/objective-creator/objective-type';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { TransitionObjectives } from '@app/game/game-logic/objectives/objectives/objective-converter/transition-objectives';

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

    // convertPrivate(objectives: Map<string, Objective[]>) {
    //     const translatedPrivate
    // }

    private translateObjective(objective: Objective): TransitionObjectives {
        const objectiveType = objective.constructor.name;
        const progressions: PlayerProgression[] = [];
        // const letterProgressions: HalfAlphabetProgression[] = [];

        objective.progressions.forEach((progression: number, playerName: string) => {
            progressions.push({ playerName, progression });

            // if (objectiveType === 'HalfAlphabet') {
            //     letterProgressions.push({ playerName, progression });
            // }
        });
        const translatedObjective: TransitionObjectives = {
            owner: objective.owner,
            name: objective.name,
            progressions,
            objectiveType: 0,
            description: objective.description,
            points: objective.points,
        };
        if (objectiveType === 'FourCorners') {
            translatedObjective.objectiveType = ObjectiveType.FourCorners;
        }
        if (objectiveType === 'TripleBonus') {
            translatedObjective.objectiveType = ObjectiveType.TripleBonus;
        }
        if (objectiveType === 'Palindrome') {
            translatedObjective.objectiveType = ObjectiveType.Palindrome;
        }
        if (objectiveType === 'TenWords') {
            translatedObjective.objectiveType = ObjectiveType.TenWords;
        }
        if (objectiveType === 'NineLettersWord') {
            translatedObjective.objectiveType = ObjectiveType.NineLettersWord;
        }
        if (objectiveType === 'HalfAlphabet') {
            translatedObjective.objectiveType = ObjectiveType.HalfAlphabet;
            // const letters = (objective as HalfAlphabet).placedLetters;
            // translatedObjective.placedLetters = [...letters];
        }
        if (objectiveType === 'SameWordTwice') {
            translatedObjective.objectiveType = ObjectiveType.SameWordTwice;
        }
        if (objectiveType === 'ThreeSameLetters') {
            translatedObjective.objectiveType = ObjectiveType.ThreeSameLetters;
        }

        return translatedObjective;
    }
}
