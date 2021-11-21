/* eslint-disable max-classes-per-file */

import { Action } from '@app/game/game-logic/actions/action';
import { Tile } from '@app/game/game-logic/board/tile';
import { BOARD_DIMENSION } from '@app/game/game-logic/constants';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { TripleBonus } from '@app/game/game-logic/objectives/objectives/triple-bonus/triple-bonus';
import { Player } from '@app/game/game-logic/player/player';
import { copyGrid, wordifyString } from '@app/game/game-logic/utils';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';

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
        objective = new TripleBonus(gameToken, objectiveNotifierStub);
        player = new MockPlayer('MockPlayer');
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
        expect(objective).to.be.instanceof(TripleBonus);
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
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
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
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
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
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
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
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
    });
});
