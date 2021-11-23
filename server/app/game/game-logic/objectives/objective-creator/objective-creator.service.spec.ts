import { PRIVATE_OBJECTIVE_COUNT, PUBLIC_OBJECTIVE_COUNT, TOTAL_OBJECTIVE_COUNT } from '@app/constants';
import { ObjectiveCreator } from '@app/game/game-logic/objectives/objective-creator/objective-creator.service';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';

describe('ObjectiveCreator', () => {
    let service: ObjectiveCreator;
    const objectiveNotifierStub = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);
    const gameToken = 'gameToken';

    beforeEach(() => {
        service = new ObjectiveCreator(objectiveNotifierStub);
    });

    it('should be created', () => {
        expect(service).to.be.instanceof(ObjectiveCreator);
    });

    it('should to create N unique objective', () => {
        const createdObjectives = service.chooseObjectives(gameToken);
        const publicObjectives = createdObjectives.publicObjectives;
        const objectivesNamesSet = new Set<string>(publicObjectives.map((objective) => objective.name));
        for (const privateObjectiveList of createdObjectives.privateObjectives) {
            for (const privateObjective of privateObjectiveList) {
                objectivesNamesSet.add(privateObjective.name);
            }
        }
        expect(objectivesNamesSet.size).to.be.equal(PRIVATE_OBJECTIVE_COUNT * 2 + PUBLIC_OBJECTIVE_COUNT);
    });

    it('should to create N unique objective and then N unique objectives with no overlap', () => {
        const createdObjectives1 = service.chooseObjectives(gameToken);
        const publicObjectives1 = createdObjectives1.publicObjectives;
        const objectivesNamesSet1 = new Set<string>(publicObjectives1.map((objective) => objective.name));
        for (const privateObjectiveList of createdObjectives1.privateObjectives) {
            for (const privateObjective of privateObjectiveList) {
                objectivesNamesSet1.add(privateObjective.name);
            }
        }
        expect(objectivesNamesSet1.size).to.be.equal(PRIVATE_OBJECTIVE_COUNT * 2 + PUBLIC_OBJECTIVE_COUNT);

        const createdObjectives2 = service.chooseObjectives(gameToken);
        const publicObjectives2 = createdObjectives2.publicObjectives;
        const objectivesNamesSet2 = new Set<string>(publicObjectives2.map((objective) => objective.name));
        for (const privateObjectiveList of createdObjectives2.privateObjectives) {
            for (const privateObjective of privateObjectiveList) {
                objectivesNamesSet2.add(privateObjective.name);
            }
        }
        expect(objectivesNamesSet2.size).to.be.equal(PRIVATE_OBJECTIVE_COUNT * 2 + PUBLIC_OBJECTIVE_COUNT);
    });

    it('should throw error when requesting an unknown objective index', () => {
        expect(() => {
            // eslint-disable-next-line dot-notation
            service['createObjective'](gameToken, TOTAL_OBJECTIVE_COUNT + 1);
        }).to.throw();
    });
});
