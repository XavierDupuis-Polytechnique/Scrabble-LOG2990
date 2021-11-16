import { ObjectiveType } from '@app/game-logic/game/objectives/objective-type';
import { FourCorners } from '@app/game-logic/game/objectives/objectives/four-corners/four-corners';
import { HalfAlphabet } from '@app/game-logic/game/objectives/objectives/half-alphabet/half-alphabet';
import { NineLettersWord } from '@app/game-logic/game/objectives/objectives/nine-letters-word/nine-letters-word';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { Palindrome } from '@app/game-logic/game/objectives/objectives/palindrome/palindrome';
import { SameWordTwice } from '@app/game-logic/game/objectives/objectives/same-word-twice/same-word-twice';
import { TenWords } from '@app/game-logic/game/objectives/objectives/ten-words/ten-words';
import { ThreeSameLetters } from '@app/game-logic/game/objectives/objectives/three-same-letters/three-same-letters';
import { TripleBonus } from '@app/game-logic/game/objectives/objectives/triple-bonus/triple-bonus';
import { getRandomInt } from '@app/game-logic/utils';

export class ObjectiveCreator {
    static privateObjectiveCount = 1;
    static publicObjectiveCount = 2;
    private static objectiveCount = 8;
    availableObjectivesIndex: number[];

    constructor() {
        this.availableObjectivesIndex = [];
        for (let index = 0; index < ObjectiveCreator.objectiveCount; index++) {
            this.availableObjectivesIndex.push(index);
        }
    }

    chooseObjectives(count: number = 1): Objective[] {
        if (this.availableObjectivesIndex.length < count) {
            throw new Error('Cannot create ' + count + ' unique objectives : only ' + this.availableObjectivesIndex.length + ' available');
        }
        const createdObjectives: Objective[] = [];
        for (let index = 0; index < count; index++) {
            const randomInt = getRandomInt(this.availableObjectivesIndex.length);
            const randomObjectiveIndex = this.availableObjectivesIndex[randomInt];
            const createdObjective = this.createObjective(randomObjectiveIndex);
            createdObjectives.push(createdObjective);
            this.availableObjectivesIndex.splice(randomObjectiveIndex, 1);
        }
        return createdObjectives;
    }

    private createObjective(objectiveIndex: number): Objective {
        switch (objectiveIndex) {
            case ObjectiveType.FourCorners:
                return new FourCorners();
            case ObjectiveType.TripleBonus:
                return new TripleBonus();
            case ObjectiveType.Palindrome:
                return new Palindrome();
            case ObjectiveType.TenWords:
                return new TenWords();
            case ObjectiveType.NineLettersWord:
                return new NineLettersWord();
            case ObjectiveType.HalfAlphabet:
                return new HalfAlphabet();
            case ObjectiveType.SameWordTwice:
                return new SameWordTwice();
            case ObjectiveType.ThreeSameLetters:
                return new ThreeSameLetters();
            default:
                throw Error('Could not create objectif with specified index ' + objectiveIndex);
        }
    }
}
