/* eslint-disable max-classes-per-file */
import { Action } from '@app/game/game-logic/actions/action';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { Palindrome } from '@app/game/game-logic/objectives/objectives/palindrome/palindrome';
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

describe('Palindrome', () => {
    let objective: Palindrome;
    let player: Player;
    let action: Action;
    const gameToken = 'gameToken';
    const objectiveNotifierStub = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);
    let params: ObjectiveUpdateParams;

    beforeEach(() => {
        objective = new Palindrome(gameToken, objectiveNotifierStub);
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
        expect(objective).to.be.instanceof(Palindrome);
    });

    it('should complete the objective with ABCBA', () => {
        params.formedWords.push(wordifyString('ABCBA'));
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
    });

    it('should complete the objective with ABCCBA', () => {
        params.formedWords.push(wordifyString('ABCCBA'));
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
    });

    it('should not complete the objective with AABCCBA', () => {
        params.formedWords.push(wordifyString('AABCCBA'));
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should not complete the objective with ABCBW', () => {
        params.formedWords.push(wordifyString('ABCBW'));
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should not complete the objective with ABCCBW', () => {
        params.formedWords.push(wordifyString('ABCCBW'));
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });
});
