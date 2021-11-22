/* eslint-disable max-classes-per-file */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { Palindrome } from '@app/game-logic/game/objectives/objectives/palindrome/palindrome';
import { Player } from '@app/game-logic/player/player';
import { wordifyString } from '@app/game-logic/utils';

class MockAction extends Action {
    protected perform(): void {
        return;
    }
}

class MockPlayer extends Player {
    setActive(): void {
        return;
    }
}

describe('Palindrome', () => {
    let objective: Palindrome;
    let player: Player;
    let action: Action;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;
    let params: ObjectiveUpdateParams;

    beforeEach(() => {
        objectiveNotifierSpy = jasmine.createSpyObj(ObjectiveNotifierService, ['sendObjectiveNotification']);
        TestBed.configureTestingModule({ providers: [{ provide: ObjectiveNotifierService, useValue: objectiveNotifierSpy }] });
        objective = new Palindrome(TestBed.inject(ObjectiveNotifierService));
        player = new MockPlayer();
        action = new MockAction(player);
        params = {
            previousGrid: [],
            currentGrid: [],
            lettersToPlace: [],
            formedWords: [],
            affectedCoords: [],
        };
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });

    it('should complete the objective with ABCBA', () => {
        params.formedWords.push(wordifyString('ABCBA'));
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
        expect(objective.owner).toBe(player.name);
        expect(player.points).toBe(objective.points);
        expect(objectiveNotifierSpy.sendObjectiveNotification).toHaveBeenCalledOnceWith(objective);
    });

    it('should complete the objective with ABCCBA', () => {
        params.formedWords.push(wordifyString('ABCCBA'));
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
        expect(objective.owner).toBe(player.name);
        expect(player.points).toBe(objective.points);
        expect(objectiveNotifierSpy.sendObjectiveNotification).toHaveBeenCalledOnceWith(objective);
    });

    it('should not complete the objective with AABCCBA', () => {
        params.formedWords.push(wordifyString('AABCCBA'));
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should not complete the objective with ABCBW', () => {
        params.formedWords.push(wordifyString('ABCBW'));
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should not complete the objective with ABCCBW', () => {
        params.formedWords.push(wordifyString('ABCCBW'));
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should do nothing when the objective is already completed', () => {
        params.formedWords.push(wordifyString('ABCBA'));
        objective.update(action, params);
        expect(objective.isCompleted).toBeTrue();
        objective.update(action, params);
        expect(objective.isCompleted).toBeTrue();
    });
});
