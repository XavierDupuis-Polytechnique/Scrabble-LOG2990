/* eslint-disable max-classes-per-file */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { Tile } from '@app/game-logic/game/board/tile';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { Palindrome } from '@app/game-logic/game/objectives/objectives/palindrome/palindrome';
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

describe('Palindrome', () => {
    let objective: Palindrome;
    let player: Player;
    let action: Action;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;

    beforeEach(() => {
        objectiveNotifierSpy = jasmine.createSpyObj(ObjectiveNotifierService, ['sendObjectiveNotification']);
        TestBed.configureTestingModule({ providers: [{ provide: ObjectiveNotifierService, useValue: objectiveNotifierSpy }] });
        objective = new Palindrome(TestBed.inject(ObjectiveNotifierService));
        player = new MockPlayer();
        action = new MockAction(player);
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });

    it('should complete the objective', () => {
        const tile1 = new Tile();
        tile1.letterObject = { char: 'A', value: 0 };
        const tile2 = new Tile();
        tile2.letterObject = { char: 'B', value: 0 };
        const tile3 = new Tile();
        tile3.letterObject = { char: 'C', value: 0 };
        const tile4 = new Tile();
        tile4.letterObject = { char: 'B', value: 0 };
        const tile5 = new Tile();
        tile5.letterObject = { char: 'A', value: 0 };
        const params: ObjectiveUpdateParams = {
            previousGrid: [],
            currentGrid: [],
            lettersToPlace: [],
            formedWords: [[tile1, tile2, tile3, tile4, tile5]],
        };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
    });

    it('should not complete the objective', () => {
        const tile1 = new Tile();
        tile1.letterObject = { char: 'A', value: 0 };
        const tile2 = new Tile();
        tile2.letterObject = { char: 'B', value: 0 };
        const tile3 = new Tile();
        tile3.letterObject = { char: 'C', value: 0 };
        const tile4 = new Tile();
        tile4.letterObject = { char: 'B', value: 0 };
        const tile5 = new Tile();
        tile5.letterObject = { char: 'W', value: 0 };
        const params: ObjectiveUpdateParams = {
            previousGrid: [],
            currentGrid: [],
            lettersToPlace: [],
            formedWords: [[tile1, tile2, tile3, tile4, tile5]],
        };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
    });
});
