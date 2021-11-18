/* eslint-disable max-classes-per-file */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { NineLettersWord } from '@app/game-logic/game/objectives/objectives/nine-letters-word/nine-letters-word';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { Player } from '@app/game-logic/player/player';
import { wordifyString } from '@app/game-logic/utils';
class MockAction extends Action {
    protected perform(): void {
        return;
    }
}

class MockPlayer extends Player {
    name = 'MockPlayer';
    setActive(): void {
        return;
    }
}

describe('NineLettersWord', () => {
    let objective: NineLettersWord;
    let player: Player;
    let action: Action;
    let params: ObjectiveUpdateParams;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;

    beforeEach(() => {
        objectiveNotifierSpy = jasmine.createSpyObj(ObjectiveNotifierService, ['sendObjectiveNotification']);
        TestBed.configureTestingModule({ providers: [{ provide: ObjectiveNotifierService, useValue: objectiveNotifierSpy }] });
        objective = new NineLettersWord(TestBed.inject(ObjectiveNotifierService));
        player = new MockPlayer();
        action = new MockAction(player);
        params = {
            previousGrid: [],
            currentGrid: [],
            lettersToPlace: [],
            formedWords: [],
        };
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });

    it('should not declare an owner if no 9 letters word are formed', () => {
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should not declare an owner if no 9 letters word are formed', () => {
        params.formedWords = [wordifyString('ABCDEFGHIJ')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });
});
