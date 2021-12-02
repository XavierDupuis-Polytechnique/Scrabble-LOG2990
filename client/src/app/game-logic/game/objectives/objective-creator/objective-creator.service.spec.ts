/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { PRIVATE_OBJECTIVE_COUNT, PUBLIC_OBJECTIVE_COUNT, TOTAL_OBJECTIVE_COUNT } from '@app/game-logic/constants';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { FourCorners } from '@app/game-logic/game/objectives/objectives/four-corners/four-corners';
import { HalfAlphabet } from '@app/game-logic/game/objectives/objectives/half-alphabet/half-alphabet';
import { NineLettersWord } from '@app/game-logic/game/objectives/objectives/nine-letters-word/nine-letters-word';
import { Palindrome } from '@app/game-logic/game/objectives/objectives/palindrome/palindrome';
import { SameWordTwice } from '@app/game-logic/game/objectives/objectives/same-word-twice/same-word-twice';
import { TenWords } from '@app/game-logic/game/objectives/objectives/ten-words/ten-words';
import { ThreeSameLetters } from '@app/game-logic/game/objectives/objectives/three-same-letters/three-same-letters';
import { TripleBonus } from '@app/game-logic/game/objectives/objectives/triple-bonus/triple-bonus';
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

    it('should be abble to create objectives for the online mode', () => {
        const objectiveName = 'objectiveName';
        const objectiveDescription = 'objectiveDescription';
        const objectivePoints = 10;
        const onlineObjective = service.createOnlineObjective(objectiveName, objectiveDescription, objectivePoints);
        expect(onlineObjective.name).toEqual(objectiveName);
        expect(onlineObjective.description).toEqual(objectiveDescription);
        expect(onlineObjective.points).toEqual(objectivePoints);
    });

    it('should to create N unique objective', () => {
        const createdObjectives = service.chooseObjectives();
        const publicObjectives = createdObjectives.publicObjectives;
        const objectivesNamesSet = new Set<string>(publicObjectives.map((objective) => objective.name));
        for (const privateObjectiveList of createdObjectives.privateObjectives) {
            for (const privateObjective of privateObjectiveList) {
                objectivesNamesSet.add(privateObjective.name);
            }
        }
        expect(objectivesNamesSet.size).toEqual(PRIVATE_OBJECTIVE_COUNT * 2 + PUBLIC_OBJECTIVE_COUNT);
    });

    it('should to create N unique objective and then N unique objectives with no overlap', () => {
        const createdObjectives1 = service.chooseObjectives();
        const publicObjectives1 = createdObjectives1.publicObjectives;
        const objectivesNamesSet1 = new Set<string>(publicObjectives1.map((objective) => objective.name));
        for (const privateObjectiveList of createdObjectives1.privateObjectives) {
            for (const privateObjective of privateObjectiveList) {
                objectivesNamesSet1.add(privateObjective.name);
            }
        }
        expect(objectivesNamesSet1.size).toEqual(PRIVATE_OBJECTIVE_COUNT * 2 + PUBLIC_OBJECTIVE_COUNT);

        const createdObjectives2 = service.chooseObjectives();
        const publicObjectives2 = createdObjectives2.publicObjectives;
        const objectivesNamesSet2 = new Set<string>(publicObjectives2.map((objective) => objective.name));
        for (const privateObjectiveList of createdObjectives2.privateObjectives) {
            for (const privateObjective of privateObjectiveList) {
                objectivesNamesSet2.add(privateObjective.name);
            }
        }
        expect(objectivesNamesSet2.size).toEqual(PRIVATE_OBJECTIVE_COUNT * 2 + PUBLIC_OBJECTIVE_COUNT);
    });

    it('should create the requested objective with corresponding index', () => {
        expect(service['createObjective'](0)).toBeInstanceOf(FourCorners);
        expect(service['createObjective'](1)).toBeInstanceOf(TripleBonus);
        expect(service['createObjective'](2)).toBeInstanceOf(Palindrome);
        expect(service['createObjective'](3)).toBeInstanceOf(TenWords);
        expect(service['createObjective'](4)).toBeInstanceOf(NineLettersWord);
        expect(service['createObjective'](5)).toBeInstanceOf(HalfAlphabet);
        expect(service['createObjective'](6)).toBeInstanceOf(SameWordTwice);
        expect(service['createObjective'](7)).toBeInstanceOf(ThreeSameLetters);
    });

    it('should throw error when requesting an unknown objective index', () => {
        expect(() => {
            service['createObjective'](TOTAL_OBJECTIVE_COUNT + 1);
        }).toThrow();
    });
});
