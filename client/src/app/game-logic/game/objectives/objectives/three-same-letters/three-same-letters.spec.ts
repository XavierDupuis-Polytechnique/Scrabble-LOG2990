/* eslint-disable max-classes-per-file */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { ThreeSameLetters } from '@app/game-logic/game/objectives/objectives/three-same-letters/three-same-letters';
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

describe('ThreeSameLetters', () => {
    let objective: ThreeSameLetters;
    let player: Player;
    let action: Action;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;
    let params: ObjectiveUpdateParams;

    beforeEach(() => {
        objectiveNotifierSpy = jasmine.createSpyObj(ObjectiveNotifierService, ['sendObjectiveNotification']);
        TestBed.configureTestingModule({ providers: [{ provide: ObjectiveNotifierService, useValue: objectiveNotifierSpy }] });
        objective = new ThreeSameLetters(TestBed.inject(ObjectiveNotifierService));
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

    it('should not complete when only 2 of the same letter are in the same word', () => {
        params.formedWords = [wordifyString('acabcb')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should not complete when 3 (or more) of the same letter are in 2 different words', () => {
        params.formedWords = [wordifyString('aba'), wordifyString('aca')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should complete when 3 of the same letter are in the same word', () => {
        params.formedWords = [wordifyString('acabacb')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
        expect(objective.owner).toBe(player.name);
        expect(player.points).toBe(objective.points);
        expect(objectiveNotifierSpy.sendObjectiveNotification).toHaveBeenCalledOnceWith(objective);
    });

    it('should complete when 4 of the same letter are in the same word', () => {
        params.formedWords = [wordifyString('acabacba')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
        expect(objective.owner).toBe(player.name);
        expect(player.points).toBe(objective.points);
        expect(objectiveNotifierSpy.sendObjectiveNotification).toHaveBeenCalledOnceWith(objective);
    });
});
