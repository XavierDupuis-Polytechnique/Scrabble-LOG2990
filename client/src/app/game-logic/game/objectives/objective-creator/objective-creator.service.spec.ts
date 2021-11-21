import { TestBed } from '@angular/core/testing';
import { PUBLIC_OBJECTIVE_COUNT, TOTAL_OBJECTIVE_COUNT } from '@app/game-logic/constants';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveCreator } from './objective-creator.service';

describe('ObjectiveCreator', () => {
    let service: ObjectiveCreator;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;

    beforeEach(() => {
        objectiveNotifierSpy = jasmine.createSpyObj(ObjectiveNotifierService, ['sendObjectiveNotification']);
        TestBed.configureTestingModule({ providers: [{ provide: ObjectiveNotifierService, useValue: objectiveNotifierSpy }] });
        service = new ObjectiveCreator(TestBed.inject(ObjectiveNotifierService));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should to create N unique objective', () => {
        const createdObjectives = service.chooseObjectives(TOTAL_OBJECTIVE_COUNT);
        const objectiveNamesSet = new Set<string>(createdObjectives.map((objective) => objective.name));
        expect(createdObjectives.length).toBe(TOTAL_OBJECTIVE_COUNT);
        expect(objectiveNamesSet.size).toBe(TOTAL_OBJECTIVE_COUNT);
        expect(service.availableObjectivesIndex.length).toBe(0);
    });

    it('should to create N unique objective and then M unique objectives with no overlap', () => {
        const createdObjectives1 = service.chooseObjectives(PUBLIC_OBJECTIVE_COUNT);
        const objectiveNamesSet1 = new Set<string>(createdObjectives1.map((objective) => objective.name));
        expect(objectiveNamesSet1.size).toBe(PUBLIC_OBJECTIVE_COUNT);

        const createdObjectives2 = service.chooseObjectives(PUBLIC_OBJECTIVE_COUNT);
        const objectiveNamesSet2 = new Set<string>(createdObjectives2.map((objective) => objective.name));
        expect(objectiveNamesSet2.size).toBe(PUBLIC_OBJECTIVE_COUNT);

        expect(service.availableObjectivesIndex.length).toBe(TOTAL_OBJECTIVE_COUNT - 2 * PUBLIC_OBJECTIVE_COUNT);
        for (const objective of objectiveNamesSet2) {
            expect(objectiveNamesSet1.has(objective)).toBeFalsy();
        }
    });

    it('should throw error when requesting more than TOTAL_OBJECTIVE_COUNT unique objectives', () => {
        expect(() => {
            service.chooseObjectives(TOTAL_OBJECTIVE_COUNT + 1);
        }).toThrow();
    });
});
