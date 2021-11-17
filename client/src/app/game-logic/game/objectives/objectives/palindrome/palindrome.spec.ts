import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { Tile } from '@app/game-logic/game/board/tile';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { Palindrome } from '@app/game-logic/game/objectives/objectives/palindrome/palindrome';

describe('Palindrome', () => {
    let objective: Palindrome;
    let action: Action;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        objective = new Palindrome(TestBed.inject(ObjectiveNotifierService));
        action = jasmine.createSpyObj(Action, ['execute']);
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
        objective.updateProgression(action, params);
        expect(objective.progression).toBe(1);
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
        objective.updateProgression(action, params);
        expect(objective.progression).toBe(0);
    });
});
