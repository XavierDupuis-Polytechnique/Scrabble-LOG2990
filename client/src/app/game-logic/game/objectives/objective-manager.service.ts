import { Injectable } from '@angular/core';
import { Action } from '@app/game-logic/actions/action';
import { Game } from '@app/game-logic/game/games/game';
import { FourCorners } from '@app/game-logic/game/objectives/objectives/four-corners';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { getRandomInt } from '@app/game-logic/utils';

enum ObjectiveType {
    FOURCOURNERS,
    sECOND,
    tHIRD,
    fOURTH,
    fIFTH,
    sIXTH,
    sEVENTH,
    eIGHTH,
}

@Injectable({
    providedIn: 'root',
})
export class ObjectiveManagerService {
    static privateObjectiveCount = 1;
    static publicObjectiveCount = 2;
    private static objectiveCount = Object.keys(ObjectiveType).length;
    availableObjectivesIndex: number[];
    objectives: Objective[];
    constructor() {
        this.availableObjectivesIndex = [];
        for (let index = 0; index < ObjectiveManagerService.objectiveCount; index++) {
            this.availableObjectivesIndex.push(index);
        }
        this.objectives = [];
    }

    checkObjectives(action: Action, game: Game) {
        return;
    }

    chooseObjectives(count: number = 1): Objective[] {
        const createdObjectives: Objective[] = [];
        for (let index = 0; index < count; index++) {
            const randomInt = getRandomInt(this.availableObjectivesIndex.length);
            const randomObjectiveIndex = this.availableObjectivesIndex[randomInt];
            switch (randomObjectiveIndex) {
                case ObjectiveType.FOURCOURNERS:
                    createdObjectives.push(new FourCorners());
                    break;

                default:
                    break;
            }
            this.availableObjectivesIndex.splice(randomObjectiveIndex, 1);
        }
        this.objectives = this.objectives.concat(createdObjectives);
        return createdObjectives;
    }
}
