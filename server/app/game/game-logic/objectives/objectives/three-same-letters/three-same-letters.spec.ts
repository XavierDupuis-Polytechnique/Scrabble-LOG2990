/* eslint-disable max-classes-per-file */

import { Action } from '@app/game/game-logic/actions/action';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { ThreeSameLetters } from '@app/game/game-logic/objectives/objectives/three-same-letters/three-same-letters';
import { Player } from '@app/game/game-logic/player/player';
import { wordifyString } from '@app/game/game-logic/utils';
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

describe('ThreeSameLetters', () => {
    let objective: ThreeSameLetters;
    let player: Player;
    let action: Action;
    const gameToken = 'gameToken';
    const objectiveNotifierStub = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);
    let params: ObjectiveUpdateParams;

    beforeEach(() => {
        objective = new ThreeSameLetters(gameToken, objectiveNotifierStub);
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
        expect(objective).to.be.instanceof(ThreeSameLetters);
    });

    it('should not complete when only 2 of the same letter are in the same word', () => {
        params.formedWords = [wordifyString('acabcb')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should not complete when 3 (or more) of the same letter are in 2 different words', () => {
        params.formedWords = [wordifyString('aba'), wordifyString('aca')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should complete when 3 of the same letter are in the same word', () => {
        params.formedWords = [wordifyString('acabacb')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
    });

    it('should complete when 4 of the same letter are in the same word', () => {
        params.formedWords = [wordifyString('acabacba')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
    });
});
