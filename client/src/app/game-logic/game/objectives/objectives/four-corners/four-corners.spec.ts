/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-classes-per-file */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { BOARD_DIMENSION, BOARD_MAX_POSITION, BOARD_MIN_POSITION, EMPTY_CHAR } from '@app/game-logic/constants';
import { Tile } from '@app/game-logic/game/board/tile';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { FourCorners } from '@app/game-logic/game/objectives/objectives/four-corners/four-corners';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { Player } from '@app/game-logic/player/player';

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

describe('FourCorners', () => {
    let objective: FourCorners;
    let player: Player;
    let action: Action;
    let params: ObjectiveUpdateParams;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;
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
        objective = new FourCorners(TestBed.inject(ObjectiveNotifierService));
        player = new MockPlayer();
        action = new MockAction(player);
        params = {
            previousGrid: [],
            currentGrid: [],
            lettersToPlace: [],
            formedWords: [],
            affectedCoords: [],
        };
        params.currentGrid = emptyGrid;
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject = { char: EMPTY_CHAR, value: 0 };
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MAX_POSITION].letterObject = { char: EMPTY_CHAR, value: 0 };
        params.currentGrid[BOARD_MIN_POSITION][BOARD_MIN_POSITION].letterObject = { char: EMPTY_CHAR, value: 0 };
        params.currentGrid[BOARD_MIN_POSITION][BOARD_MAX_POSITION].letterObject = { char: EMPTY_CHAR, value: 0 };
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });

    it('should not complete if no corners are filled', () => {
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should update progression for 1 corner filled', () => {
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'A', value: 0 };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0.25);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should update progression for 2 corners filled', () => {
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'A', value: 0 };
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MAX_POSITION].letterObject = { char: 'B', value: 0 };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0.5);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should update progression for 3 corners filled', () => {
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'A', value: 0 };
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MAX_POSITION].letterObject = { char: 'B', value: 0 };
        params.currentGrid[BOARD_MIN_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'C', value: 0 };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(0.75);
        expect(objective.owner).toBeUndefined();
        expect(player.points).toBe(0);
        expect(objectiveNotifierSpy.sendObjectiveNotification).not.toHaveBeenCalled();
    });

    it('should update progression when 4 corners are filled', () => {
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'A', value: 0 };
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MAX_POSITION].letterObject = { char: 'B', value: 0 };
        params.currentGrid[BOARD_MIN_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'C', value: 0 };
        params.currentGrid[BOARD_MIN_POSITION][BOARD_MAX_POSITION].letterObject = { char: 'D', value: 0 };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).toBe(1);
        expect(objective.owner).toBe(player.name);
        expect(player.points).toBe(objective.points);
        expect(objectiveNotifierSpy.sendObjectiveNotification).toHaveBeenCalledOnceWith(objective);
    });
});
