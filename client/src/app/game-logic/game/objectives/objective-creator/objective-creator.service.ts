import { Injectable } from '@angular/core';
import { PRIVATE_OBJECTIVE_COUNT, PUBLIC_OBJECTIVE_COUNT, TOTAL_OBJECTIVE_COUNT } from '@app/game-logic/constants';
import { GeneratedObjectives } from '@app/game-logic/game/objectives/objective-creator/generated-objectives.interface';
import { ObjectiveType } from '@app/game-logic/game/objectives/objective-creator/objective-type';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { FourCorners } from '@app/game-logic/game/objectives/objectives/four-corners/four-corners';
import { HalfAlphabet } from '@app/game-logic/game/objectives/objectives/half-alphabet/half-alphabet';
import { NineLettersWord } from '@app/game-logic/game/objectives/objectives/nine-letters-word/nine-letters-word';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { Palindrome } from '@app/game-logic/game/objectives/objectives/palindrome/palindrome';
import { SameWordTwice } from '@app/game-logic/game/objectives/objectives/same-word-twice/same-word-twice';
import { TenWords } from '@app/game-logic/game/objectives/objectives/ten-words/ten-words';
import { ThreeSameLetters } from '@app/game-logic/game/objectives/objectives/three-same-letters/three-same-letters';
import { TripleBonus } from '@app/game-logic/game/objectives/objectives/triple-bonus/triple-bonus';
import { OnlineObjective } from '@app/game-logic/game/objectives/online-objective/online-objective';
import { getRandomInt } from '@app/game-logic/utils';

@Injectable({
    providedIn: 'root',
})
export class ObjectiveCreator {
    constructor(private objectiveNotifier: ObjectiveNotifierService) {}

    chooseObjectives(): GeneratedObjectives {
        const availableObjectivesIndex = this.getAvailableObjectivesIndex();

        const privateObjectives1 = this.createObjectives(PRIVATE_OBJECTIVE_COUNT, availableObjectivesIndex);
        const privateObjectives2 = this.createObjectives(PRIVATE_OBJECTIVE_COUNT, availableObjectivesIndex);
        const privateObjectives = [privateObjectives1, privateObjectives2];

        const publicObjectives = this.createObjectives(PUBLIC_OBJECTIVE_COUNT, availableObjectivesIndex);
        return { privateObjectives, publicObjectives };
    }

    createOnlineObjective(name: string, description: string, points: number): OnlineObjective {
        return new OnlineObjective(this.objectiveNotifier, name, description, points);
    }

    createObjective(objectiveType: ObjectiveType): Objective {
        switch (objectiveType) {
            case ObjectiveType.FourCorners:
                return new FourCorners(this.objectiveNotifier);
            case ObjectiveType.TripleBonus:
                return new TripleBonus(this.objectiveNotifier);
            case ObjectiveType.Palindrome:
                return new Palindrome(this.objectiveNotifier);
            case ObjectiveType.TenWords:
                return new TenWords(this.objectiveNotifier);
            case ObjectiveType.NineLettersWord:
                return new NineLettersWord(this.objectiveNotifier);
            case ObjectiveType.HalfAlphabet:
                return new HalfAlphabet(this.objectiveNotifier);
            case ObjectiveType.SameWordTwice:
                return new SameWordTwice(this.objectiveNotifier);
            case ObjectiveType.ThreeSameLetters:
                return new ThreeSameLetters(this.objectiveNotifier);
            default:
                throw Error('Could not create objectif with specified index ' + objectiveType);
        }
    }

    private createObjectives(count: number, availableObjectivesIndex: number[]) {
        const createdObjectives: Objective[] = [];
        for (let index = 0; index < count; index++) {
            const randomInt = getRandomInt(availableObjectivesIndex.length);
            const randomObjectiveIndex = availableObjectivesIndex[randomInt];
            const createdObjective = this.createObjective(randomObjectiveIndex);
            createdObjectives.push(createdObjective);
            availableObjectivesIndex.splice(randomInt, 1);
        }
        return createdObjectives;
    }

    private getAvailableObjectivesIndex() {
        return [...Array(TOTAL_OBJECTIVE_COUNT).keys()];
    }
}
