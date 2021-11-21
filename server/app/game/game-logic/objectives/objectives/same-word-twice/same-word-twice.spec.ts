/* eslint-disable max-classes-per-file */

import { Action } from '@app/game/game-logic/actions/action';
import { Tile } from '@app/game/game-logic/board/tile';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { SameWordTwice } from '@app/game/game-logic/objectives/objectives/same-word-twice/same-word-twice';
import { Player } from '@app/game/game-logic/player/player';
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

describe('SameWordTwice', () => {
    let objective: SameWordTwice;
    let player: Player;
    let action: Action;
    const gameToken = 'gameToken';
    const objectiveNotifierStub = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);

    beforeEach(() => {
        objective = new SameWordTwice(gameToken, objectiveNotifierStub);
        player = new MockPlayer('MockPlayer');
        action = new MockAction(player);
    });

    it('should be created', () => {
        expect(objective).to.be.instanceof(SameWordTwice);
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
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
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
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });
});
