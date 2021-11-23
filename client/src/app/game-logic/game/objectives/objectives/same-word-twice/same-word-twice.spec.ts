/* eslint-disable max-classes-per-file */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { Tile } from '@app/game-logic/game/board/tile';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { SameWordTwice } from '@app/game-logic/game/objectives/objectives/same-word-twice/same-word-twice';
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

describe('SameWordTwice', () => {
    let objective: SameWordTwice;
    let player: Player;
    let action: Action;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;

    beforeEach(() => {
        objectiveNotifierSpy = jasmine.createSpyObj(ObjectiveNotifierService, ['sendObjectiveNotification']);
        TestBed.configureTestingModule({ providers: [{ provide: ObjectiveNotifierService, useValue: objectiveNotifierSpy }] });
        objective = new SameWordTwice(TestBed.inject(ObjectiveNotifierService));
        player = new MockPlayer();
        action = new MockAction(player);
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });

    it('should be completed', () => {
        const tile1 = new Tile();
        tile1.letterObject = { char: 'A', value: 0 };
        const tile2 = new Tile();
        tile2.letterObject = { char: 'B', value: 0 };
        const params: ObjectiveUpdateParams = {
            currentGrid: [],
            previousGrid: [],
            lettersToPlace: [],
            formedWords: [
                [tile1, tile2],
                [tile1, tile2],
            ],
            affectedCoords: [],
        };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
        expect(objective.owner).toBe(player.name);
        expect(player.points).toBe(objective.points);
        expect(objectiveNotifierSpy.sendObjectiveNotification).toHaveBeenCalledOnceWith(objective);
    });

    it('should not be completed', () => {
        const tile1 = new Tile();
        tile1.letterObject = { char: 'A', value: 0 };
        const tile2 = new Tile();
        tile2.letterObject = { char: 'B', value: 0 };
        const params: ObjectiveUpdateParams = {
            currentGrid: [],
            previousGrid: [],
            lettersToPlace: [],
            formedWords: [
                [tile1, tile2],
                [tile1, tile1],
            ],
            affectedCoords: [],
        };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });
});
