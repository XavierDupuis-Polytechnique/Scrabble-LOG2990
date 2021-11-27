/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { Board } from '@app/game/game-logic/board/board';
import { LetterBag } from '@app/game/game-logic/board/letter-bag';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { SpecialServerGame } from '@app/game/game-logic/game/special-server-game';
import { SpecialGameState } from '@app/game/game-logic/interface/game-state.interface';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { Player } from '@app/game/game-logic/player/player';
import { createSinonStubInstance, StubbedClass } from '@app/test.util';
import { expect } from 'chai';
import * as sinon from 'sinon';

class MockObjective extends Objective {
    name = 'mockObjective';
    points = 123;
    completed = false;
    get isCompleted(): boolean {
        return this.completed;
    }
    update(): void {
        this.completed = true;
    }
    protected updateProgression(): void {
        return;
    }
}

describe('GameCompilerService', () => {
    const gameCompilerService = new GameCompiler();
    const letterBag = new LetterBag();
    let game: StubbedClass<ServerGame>;
    const objectiveNotifierStub = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);
    const gameToken = 'gameToken';

    beforeEach(() => {
        const board = createSinonStubInstance<Board>(Board);
        game = createSinonStubInstance<ServerGame>(ServerGame);
        game.players = [new Player('Joueur1'), new Player('Joueur2')];
        game.activePlayerIndex = 0;
        game.board = board;
        game.letterBag = letterBag;
    });

    it('should return an instance of gameState', () => {
        const gameCompilerSpy = sinon.spy(gameCompilerService, 'compile');
        const compiledGame = gameCompilerService.compile(game);
        expect(gameCompilerSpy.returned(compiledGame)).to.be.true;
    });

    it('should return correct values of game', () => {
        game.isEndOfGame.returns(false);
        const compiledGame = gameCompilerService.compile(game);
        expect(compiledGame.activePlayerIndex).to.equal(game.activePlayerIndex);
        expect(compiledGame.isEndOfGame).to.equal(game.isEndOfGame());
        expect(compiledGame.lettersRemaining).to.equal(game.letterBag.lettersLeft);
    });

    it('should return two winner on endOfGame if getWinner was 2 players', () => {
        game.isEndOfGame.returns(true);
        game.getWinner.returns(game.players);

        const compiledGame = gameCompilerService.compile(game);
        expect(compiledGame.winnerIndex.length).to.equal(2);
    });

    it('should return correct winner on endOfGame', () => {
        game.isEndOfGame.returns(true);
        game.getWinner.returns([game.players[0]]);

        const compiledGame = gameCompilerService.compile(game);
        expect(compiledGame.winnerIndex[0]).to.equal(0);
    });

    it('should return correct winner on endOfGame', () => {
        game.isEndOfGame.returns(true);
        game.getWinner.returns([game.players[1]]);

        const compiledGame = gameCompilerService.compile(game);
        expect(compiledGame.winnerIndex[0]).to.equal(1);
    });

    it('should return an instance of specialGameState', () => {
        const specialGame = createSinonStubInstance<SpecialServerGame>(SpecialServerGame);
        const p1 = new Player('Joueur1');
        const p2 = new Player('Joueur2');
        specialGame.players = [p1, p2];
        specialGame.activePlayerIndex = 0;
        specialGame.board = createSinonStubInstance<Board>(Board);
        specialGame.letterBag = letterBag;
        specialGame.publicObjectives = [new MockObjective(gameToken, objectiveNotifierStub), new MockObjective(gameToken, objectiveNotifierStub)];
        specialGame.privateObjectives = new Map<string, Objective[]>();
        specialGame.privateObjectives.set(p1.name, [new MockObjective(gameToken, objectiveNotifierStub)]);
        specialGame.privateObjectives.set(p2.name, [new MockObjective(gameToken, objectiveNotifierStub)]);

        const compiledGame = gameCompilerService.compile(specialGame) as SpecialGameState;
        expect(compiledGame.publicObjectives.length).to.equal(specialGame.publicObjectives.length);
        for (const [playerName, privateObjective] of specialGame.privateObjectives) {
            const playerPrivateLightObjectives = compiledGame.privateObjectives.find(
                (privateLightObjective) => privateLightObjective.playerName === playerName,
            );
            expect(playerPrivateLightObjectives?.privateObjectives.length).to.equal(privateObjective.length);
        }
    });
});
