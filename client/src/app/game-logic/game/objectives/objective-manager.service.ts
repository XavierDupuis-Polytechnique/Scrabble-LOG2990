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
// TODO: change responsabiltity to only manage objectives in multiplayer it is going to receive
// a list with objectives so the update methode is just going to update the objectives attributes
// in solo it is going to update them with the update method of every objective
// therefore ObjectiveManagerService is not going to be responsible for the creation of objectives
@Injectable({
    providedIn: 'root',
})
export class ObjectiveManagerService {
    static privateObjectiveCount = 1;
    static publicObjectiveCount = 2;
    private static objectiveCount = Object.keys(ObjectiveType).length;
    availableObjectivesIndex: number[];
    objectives: Objective[];
    // weird to do that in constructor that means it gonna do it one time
    constructor() {
        this.availableObjectivesIndex = [];
        for (let index = 0; index < ObjectiveManagerService.objectiveCount; index++) {
            this.availableObjectivesIndex.push(index);
        }
        this.objectives = [];
    }

    updateObjectives(action: Action, game: Game) {
        for (const objective of this.objectives) {
            objective.update(action, game);
        }
    }
    // TODO: game should do that
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
        this.objectives = this.objectives.concat(createdObjectives);
        return createdObjectives;
    }

    // TODO" put that in a util func or in another class for exemple (objective-creator)
    private createObjective(objectiveIndex: number): Objective {
        switch (objectiveIndex) {
            case ObjectiveType.FOURCOURNERS:
                return new FourCorners();

            default:
                throw Error('Could not create objectif with specified index ' + objectiveIndex);
        }
    }
}
