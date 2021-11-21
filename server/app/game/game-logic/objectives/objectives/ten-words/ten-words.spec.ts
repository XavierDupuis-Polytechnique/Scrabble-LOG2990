/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-classes-per-file */

import { TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE } from '@app/constants';
import { Action } from '@app/game/game-logic/actions/action';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { TenWords } from '@app/game/game-logic/objectives/objectives/ten-words/ten-words';
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

describe('TenWords', () => {
    let objective: TenWords;
    let player: Player;
    let action: Action;
    const gameToken = 'gameToken';
    const objectiveNotifierStub = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);
    let params: ObjectiveUpdateParams;

    beforeEach(() => {
        objective = new TenWords(gameToken, objectiveNotifierStub);
        player = new MockPlayer('MockPlayer');
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
        expect(objective).to.be.instanceof(TenWords);
    });

    it('should not complete when less than 10 placeLetter action are executed (for the same player)', () => {
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE - 1; i++) {
            objective.update(action, params);
        }
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0.9);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should not complete when 9 placeLetter action are executed for each player', () => {
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE - 1; i++) {
            objective.update(action, params);
        }

        const otherPlayer = new MockPlayer('otherPlayer');
        const otherAction = new MockAction(otherPlayer);
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE - 1; i++) {
            objective.update(otherAction, params);
        }

        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0.9);
        expect(objective.getPlayerProgression(otherAction.player.name)).to.be.equal(0.9);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should complete when 10 placeLetter action are executed (for the same player) when players are playing alternatively', () => {
        const otherPlayer = new MockPlayer('otherPlayer');
        const otherAction = new MockAction(otherPlayer);
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE - 1; i++) {
            objective.update(action, params);
            objective.update(otherAction, params);
        }
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.getPlayerProgression(otherAction.player.name)).to.be.equal(0.9);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
    });

    it('should complete when 10 placeLetter action are executed (for the same player)', () => {
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE; i++) {
            objective.update(action, params);
        }
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
    });
});
