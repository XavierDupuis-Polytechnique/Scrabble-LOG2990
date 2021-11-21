import { PUBLIC_OBJECTIVE_COUNT, TOTAL_OBJECTIVE_COUNT } from '@app/constants';
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
        expect(service).to.be.equal(true);
    });

    it('should to create N unique objective', () => {
        const createdObjectives = service.chooseObjectives(gameToken, TOTAL_OBJECTIVE_COUNT);
        const objectiveNamesSet = new Set<string>(createdObjectives.map((objective) => objective.name));
        expect(createdObjectives.length).to.be.equal(TOTAL_OBJECTIVE_COUNT);
        expect(objectiveNamesSet.size).to.be.equal(TOTAL_OBJECTIVE_COUNT);
        expect(service.availableObjectivesIndex.length).to.be.equal(0);
    });

    it('should to create N unique objective and then M unique objectives with no overlap', () => {
        const createdObjectives1 = service.chooseObjectives(gameToken, PUBLIC_OBJECTIVE_COUNT);
        const objectiveNamesSet1 = new Set<string>(createdObjectives1.map((objective) => objective.name));
        expect(objectiveNamesSet1.size).to.be.equal(PUBLIC_OBJECTIVE_COUNT);

        const createdObjectives2 = service.chooseObjectives(gameToken, PUBLIC_OBJECTIVE_COUNT);
        const objectiveNamesSet2 = new Set<string>(createdObjectives2.map((objective) => objective.name));
        expect(objectiveNamesSet2.size).to.be.equal(PUBLIC_OBJECTIVE_COUNT);

        expect(service.availableObjectivesIndex.length).to.be.equal(TOTAL_OBJECTIVE_COUNT - 2 * PUBLIC_OBJECTIVE_COUNT);
        for (const objective of objectiveNamesSet2) {
            expect(objectiveNamesSet1.has(objective)).to.be.equal(false);
        }
    });

    it('should throw error when requesting more than TOTAL_OBJECTIVE_COUNT unique objectives', () => {
        expect(() => {
            service.chooseObjectives(gameToken, TOTAL_OBJECTIVE_COUNT + 1);
        }).to.throw();
    });
});
