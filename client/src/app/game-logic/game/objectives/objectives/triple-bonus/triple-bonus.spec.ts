/* eslint-disable max-classes-per-file */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { BOARD_DIMENSION } from '@app/game-logic/constants';
import { Tile } from '@app/game-logic/game/board/tile';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { TripleBonus } from '@app/game-logic/game/objectives/objectives/triple-bonus/triple-bonus';
import { Player } from '@app/game-logic/player/player';
import { copyGrid, wordifyString } from '@app/game-logic/utils';
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

describe('TripleBonus', () => {
    let objective: TripleBonus;
    let player: Player;
    let action: Action;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;
    let params: ObjectiveUpdateParams;
    const emptyGrid: Tile[][] = [];
    for (let i = 0; i < BOARD_DIMENSION; i++) {
        const row: Tile[] = [];
        for (let j = 0; j < BOARD_DIMENSION; j++) {
            row.push(new Tile());
        }
        emptyGrid.push(row);
    }

    beforeEach(() => {
        objectiveNotifierSpy = jasmine.createSpyObj(ObjectiveNotifierService, ['sendObjectiveNotification']);
        TestBed.configureTestingModule({ providers: [{ provide: ObjectiveNotifierService, useValue: objectiveNotifierSpy }] });
        objective = new TripleBonus(TestBed.inject(ObjectiveNotifierService));
        player = new MockPlayer();
        action = new MockAction(player);
        params = {
            previousGrid: copyGrid(emptyGrid),
            currentGrid: copyGrid(emptyGrid),
            lettersToPlace: [],
            formedWords: [],
            affectedCoords: [],
        };
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });

    it('should not complete when only 2 bonus are used (2 bonus available and 3 affected coords)', () => {
        params.affectedCoords = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
        ];
        params.previousGrid[0][0].letterMultiplicator = 2;
        params.previousGrid[0][1].letterMultiplicator = 1;
        params.previousGrid[0][2].letterMultiplicator = 2;
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should not complete when only 2 bonus are used (3 bonus available and 2 affected coords)', () => {
        params.affectedCoords = [
            { x: 0, y: 0 },
            { x: 2, y: 0 },
        ];
        params.previousGrid[0][0].letterMultiplicator = 2;
        params.previousGrid[0][1].letterMultiplicator = 2;
        params.previousGrid[0][2].letterMultiplicator = 2;
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should complete when 3 bonus are used (3 bonus available and 3 affected coords)', () => {
        params.affectedCoords = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
        ];
        params.previousGrid[0][0].letterMultiplicator = 2;
        params.previousGrid[0][1].letterMultiplicator = 2;
        params.previousGrid[0][2].letterMultiplicator = 2;
        params.formedWords = [wordifyString('acabacb')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
        expect(objective.owner).toBe(player.name);
        expect(player.points).toBe(objective.points);
        expect(objectiveNotifierSpy.sendObjectiveNotification).toHaveBeenCalledOnceWith(objective);
    });

    it('should complete when 3 bonus of different types are used', () => {
        params.affectedCoords = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
        ];
        params.previousGrid[0][0].letterMultiplicator = 2;
        params.previousGrid[0][1].wordMultiplicator = 2;
        params.previousGrid[0][2].letterMultiplicator = 2;
        params.formedWords = [wordifyString('acabacb')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
        expect(objective.owner).toBe(player.name);
        expect(player.points).toBe(objective.points);
        expect(objectiveNotifierSpy.sendObjectiveNotification).toHaveBeenCalledOnceWith(objective);
    });
});
