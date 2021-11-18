import { PRIVATE_OBJECTIVE_COUNT, PUBLIC_OBJECTIVE_COUNT, TOTAL_OBJECTIVE_COUNT } from '@app/constants';
import { ObjectiveType } from '@app/game/game-logic/objectives/objective-creator/objective-type';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { FourCorners } from '@app/game/game-logic/objectives/objectives/four-corners/four-corners';
import { HalfAlphabet } from '@app/game/game-logic/objectives/objectives/half-alphabet/half-alphabet';
import { NineLettersWord } from '@app/game/game-logic/objectives/objectives/nine-letters-word/nine-letters-word';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { Palindrome } from '@app/game/game-logic/objectives/objectives/palindrome/palindrome';
import { SameWordTwice } from '@app/game/game-logic/objectives/objectives/same-word-twice/same-word-twice';
import { TenWords } from '@app/game/game-logic/objectives/objectives/ten-words/ten-words';
import { ThreeSameLetters } from '@app/game/game-logic/objectives/objectives/three-same-letters/three-same-letters';
import { TripleBonus } from '@app/game/game-logic/objectives/objectives/triple-bonus/triple-bonus';
import { getRandomInt } from '@app/game/game-logic/utils';
import { Service } from 'typedi';

@Service()
export class ObjectiveCreator {
    static privateObjectiveCount = PRIVATE_OBJECTIVE_COUNT;
    static publicObjectiveCount = PUBLIC_OBJECTIVE_COUNT;
    private static objectiveCount = TOTAL_OBJECTIVE_COUNT;
    availableObjectivesIndex: number[];

    constructor(private objectiveNotifier: ObjectiveNotifierService) {
        this.availableObjectivesIndex = [];
        for (let index = 0; index < ObjectiveCreator.objectiveCount; index++) {
            this.availableObjectivesIndex.push(index);
        }
    }

    chooseObjectives(gameToken: string, count: number = 1): Objective[] {
        if (this.availableObjectivesIndex.length < count) {
            throw new Error('Cannot create ' + count + ' unique objectives : only ' + this.availableObjectivesIndex.length + ' available');
        }
        const createdObjectives: Objective[] = [];
        for (let index = 0; index < count; index++) {
            const randomInt = getRandomInt(this.availableObjectivesIndex.length);
            const randomObjectiveIndex = this.availableObjectivesIndex[randomInt];
            const createdObjective = this.createObjective(gameToken, randomObjectiveIndex);
            createdObjectives.push(createdObjective);
            this.availableObjectivesIndex.splice(randomInt, 1);
        }
        return createdObjectives;
    }

    private createObjective(gameToken: string, objectiveIndex: number): Objective {
        switch (objectiveIndex) {
            case ObjectiveType.FourCorners:
                return new FourCorners(gameToken, this.objectiveNotifier);
            case ObjectiveType.TripleBonus:
                return new TripleBonus(gameToken, this.objectiveNotifier);
            case ObjectiveType.Palindrome:
                return new Palindrome(gameToken, this.objectiveNotifier);
            case ObjectiveType.TenWords:
                return new TenWords(gameToken, this.objectiveNotifier);
            case ObjectiveType.NineLettersWord:
                return new NineLettersWord(gameToken, this.objectiveNotifier);
            case ObjectiveType.HalfAlphabet:
                return new HalfAlphabet(gameToken, this.objectiveNotifier);
            case ObjectiveType.SameWordTwice:
                return new SameWordTwice(gameToken, this.objectiveNotifier);
            case ObjectiveType.ThreeSameLetters:
                return new ThreeSameLetters(gameToken, this.objectiveNotifier);
            default:
                throw Error('Could not create objectif with specified index ' + objectiveIndex);
        }
    }
}
