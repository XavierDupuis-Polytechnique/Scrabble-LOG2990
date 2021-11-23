/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-classes-per-file */

import { Action } from '@app/game/game-logic/actions/action';
import { Tile } from '@app/game/game-logic/board/tile';
import { BOARD_DIMENSION, BOARD_MAX_POSITION, BOARD_MIN_POSITION, EMPTY_CHAR } from '@app/game/game-logic/constants';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { FourCorners } from '@app/game/game-logic/objectives/objectives/four-corners/four-corners';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { Player } from '@app/game/game-logic/player/player';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';

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
    const gameToken = 'gameToken';
    const objectiveNotifierStub = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);
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
        objective = new FourCorners(gameToken, objectiveNotifierStub);
        player = new MockPlayer('MockPlayer');
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
        expect(objective).to.be.instanceof(FourCorners);
    });

    it('should not complete if no corners are filled', () => {
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should update progression for 1 corner filled', () => {
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'A', value: 0 };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0.25);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should update progression for 2 corners filled', () => {
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'A', value: 0 };
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MAX_POSITION].letterObject = { char: 'B', value: 0 };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0.5);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should update progression for 3 corners filled', () => {
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'A', value: 0 };
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MAX_POSITION].letterObject = { char: 'B', value: 0 };
        params.currentGrid[BOARD_MIN_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'C', value: 0 };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0.75);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should update progression when 4 corners are filled', () => {
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'A', value: 0 };
        params.currentGrid[BOARD_MAX_POSITION][BOARD_MAX_POSITION].letterObject = { char: 'B', value: 0 };
        params.currentGrid[BOARD_MIN_POSITION][BOARD_MIN_POSITION].letterObject = { char: 'C', value: 0 };
        params.currentGrid[BOARD_MIN_POSITION][BOARD_MAX_POSITION].letterObject = { char: 'D', value: 0 };
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
    });
});
