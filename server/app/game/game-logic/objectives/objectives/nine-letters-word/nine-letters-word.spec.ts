/* eslint-disable max-classes-per-file */

import { Action } from '@app/game/game-logic/actions/action';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { NineLettersWord } from '@app/game/game-logic/objectives/objectives/nine-letters-word/nine-letters-word';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
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
    name = 'MockPlayer';
    setActive(): void {
        return;
    }
}

describe('NineLettersWord', () => {
    let objective: NineLettersWord;
    let player: Player;
    let action: Action;
    const gameToken = 'gameToken';
    let params: ObjectiveUpdateParams;
    const objectiveNotifierStub = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);

    beforeEach(() => {
        objective = new NineLettersWord(gameToken, objectiveNotifierStub);
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
        expect(objective).to.be.instanceof(NineLettersWord);
    });

    it('should not complete if no 9 letters word are formed', () => {
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should not complete if a 8 letters word is formed', () => {
        params.formedWords = [wordifyString('ABCDEFGH')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });

    it('should complete if a 9 letters word is formed', () => {
        params.formedWords = [wordifyString('ABCDEFGHI')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(1);
        expect(objective.owner).to.be.equal(player.name);
        expect(player.points).to.be.equal(objective.points);
    });

    it('should not complete if a 10 letters word is formed', () => {
        params.formedWords = [wordifyString('ABCDEFGHIJ')];
        objective.update(action, params);
        expect(objective.getPlayerProgression(action.player.name)).to.be.equal(0);
        expect(objective.owner).to.be.equal(undefined);
        expect(player.points).to.be.equal(0);
    });
});
