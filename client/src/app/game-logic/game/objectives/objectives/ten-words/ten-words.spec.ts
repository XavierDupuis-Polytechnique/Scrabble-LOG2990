/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-classes-per-file */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE } from '@app/game-logic/constants';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { TenWords } from '@app/game-logic/game/objectives/objectives/ten-words/ten-words';
import { Player } from '@app/game-logic/player/player';

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

describe('TenWords', () => {
    let objective: TenWords;
    let player: Player;
    let action: Action;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;
    let params: ObjectiveUpdateParams;

    beforeEach(() => {
        objectiveNotifierSpy = jasmine.createSpyObj(ObjectiveNotifierService, ['sendObjectiveNotification']);
        TestBed.configureTestingModule({ providers: [{ provide: ObjectiveNotifierService, useValue: objectiveNotifierSpy }] });
        objective = new TenWords(TestBed.inject(ObjectiveNotifierService));
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

    it('should not complete when less than 10 placeLetter action are executed (for the same player)', () => {
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE - 1; i++) {
            objective.update(action, params);
        }
        expect(objective.getPlayerProgression(action.player.name)).toBe(0.9);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should not complete when 9 placeLetter action are executed for each player', () => {
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE - 1; i++) {
            objective.update(action, params);
        }

        const otherPlayer = new MockPlayer();
        otherPlayer.name = 'otherPlayer';
        const otherAction = new MockAction(otherPlayer);
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE - 1; i++) {
            objective.update(otherAction, params);
        }

        expect(objective.getPlayerProgression(action.player.name)).toBe(0.9);
        expect(objective.getPlayerProgression(otherAction.player.name)).toBe(0.9);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should complete when 10 placeLetter action are executed (for the same player) when players are playing alternatively', () => {
        const otherPlayer = new MockPlayer();
        otherPlayer.name = 'otherPlayer';
        const otherAction = new MockAction(otherPlayer);
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE - 1; i++) {
            objective.update(action, params);
            objective.update(otherAction, params);
        }
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
        expect(objective.getPlayerProgression(otherAction.player.name)).toBe(0.9);
        expect(objective.owner).toBe(player.name);
        expect(player.points).toBe(objective.points);
        expect(objectiveNotifierSpy.sendObjectiveNotification).toHaveBeenCalledOnceWith(objective);
    });

    it('should complete when 10 placeLetter action are executed (for the same player)', () => {
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE; i++) {
            objective.update(action, params);
        }
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
        expect(objective.owner).toBe(player.name);
        expect(player.points).toBe(objective.points);
        expect(objectiveNotifierSpy.sendObjectiveNotification).toHaveBeenCalledOnceWith(objective);
    });
});
