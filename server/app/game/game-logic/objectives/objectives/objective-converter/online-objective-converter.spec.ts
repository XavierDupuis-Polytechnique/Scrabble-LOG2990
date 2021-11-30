/* eslint-disable dot-notation */
import { ObjectiveCreator } from '@app/game/game-logic/objectives/objective-creator/objective-creator.service';
import { ObjectiveType } from '@app/game/game-logic/objectives/objective-creator/objective-type';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { OnlineObjectiveConverter } from '@app/game/game-logic/objectives/objectives/objective-converter/online-objective-converter';
import { TransitionObjectives } from '@app/game/game-logic/objectives/objectives/objective-converter/transition-objectives';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';

describe('OnlineObjectiveConverter', () => {
    let onlineObjectiveConverter: OnlineObjectiveConverter;
    let stubObjectiveCreator: ObjectiveCreator;

    before(() => {
        stubObjectiveCreator = createSinonStubInstance<ObjectiveCreator>(ObjectiveCreator);
    });

    it('should create adequate transition objectives', () => {
        const publicObjective: Objective[] = [];
        const expectedTransitionObjectives: TransitionObjectives[] = [];
        const publicObjectiveCount = Object.keys(ObjectiveType).length / 2;
        let privateObjectiveCount = 0;

        for (let i = 0; i < publicObjectiveCount; i++) {
            const objective = stubObjectiveCreator['createObjective']('1', i);
            if (i < publicObjectiveCount) {
                publicObjective.push(objective);
            }

            privateObjectiveCount = i + 1;
            const expectedTransitionObjective: TransitionObjectives = {
                objectiveType: i,
                name: objective.name,
                description: objective.description,
                points: objective.points,
                owner: undefined,
                progressions: [],
            };
            expectedTransitionObjectives.push(expectedTransitionObjective);
        }

        const privateObjectives = new Map<string, Objective[]>();
        const privateObjectivesArray: Objective[] = [];
        const expectedPrivateObjective = stubObjectiveCreator['createObjective']('1', privateObjectiveCount);
        privateObjectivesArray.push(expectedPrivateObjective);
        privateObjectives.set('key1', privateObjectivesArray);
        const testTransitionObjectives = onlineObjectiveConverter.convertObjectives(publicObjective, privateObjectives);

        expect(testTransitionObjectives).to.equal(expectedTransitionObjectives);
    });
});
