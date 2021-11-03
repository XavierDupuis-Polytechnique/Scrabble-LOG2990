/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
import { Board } from '@app/game/game-logic/board/board';
import { LetterBag } from '@app/game/game-logic/board/letter-bag';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { Player } from '@app/game/game-logic/player/player';
import { GameCompiler } from '@app/services/game-compiler.service';
import { createSinonStubInstance, StubbedClass } from '@app/test.util';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('GameCompiler service', () => {
    // Mock game and all of those shit
    const gameCompilerService = new GameCompiler();
    // const gameToken = 'abc';
    // const mockGameState$ = new Subject<GameStateToken>();
    // const players = [
    //     {
    //         name: 'Joueur1',
    //         isActive: true,
    //         points: 10,
    //         letterRack: [
    //             { char: 'a', value: 1 },
    //             { char: 'b', value: 2 },
    //             { char: 'c', value: 3 },
    //         ],
    //     },
    //     {
    //         name: 'Joueur2',
    //         isActive: false,
    //         points: 15,
    //         letterRack: [
    //             { char: 'e', value: 1 },
    //             { char: 'b', value: 2 },
    //             { char: 'm', value: 3 },
    //         ],
    //     },
    // ];
    const letterBag = new LetterBag();
    let game: StubbedClass<ServerGame>;
    // let gameState: GameState;

    beforeEach(() => {
        const board = createSinonStubInstance<Board>(Board);
        game = createSinonStubInstance<ServerGame>(ServerGame);
        game.players = [new Player('Joueur1'), new Player('Joueur2')];
        game.activePlayerIndex = 0;
        game.board = board;
        game.letterBag = letterBag;
        // gameState = {
        //     players,
        //     activePlayerIndex: 1,
        //     grid: boardService.grid,
        //     lettersRemaining: 50,
        //     isEndOfGame: false,
        //     winnerIndex: [],
        // };
        // mockGameState$.next({ gameState, gameToken });
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
        // const gameCompilerSpy = sinon.spy(gameCompilerService, 'compile');
        game.isEndOfGame.returns(true);
        game.getWinner.returns(game.players);

        const compiledGame = gameCompilerService.compile(game);
        expect(compiledGame.winnerIndex.length).to.equal(2);
    });

    it('should return correct winner on endOfGame', () => {
        // const gameCompilerSpy = sinon.spy(gameCompilerService, 'compile');
        game.isEndOfGame.returns(true);
        game.getWinner.returns([game.players[0]]);

        const compiledGame = gameCompilerService.compile(game);
        expect(compiledGame.winnerIndex[0]).to.equal(0);
    });
    it('should return correct winner on endOfGame', () => {
        // const gameCompilerSpy = sinon.spy(gameCompilerService, 'compile');
        game.isEndOfGame.returns(true);
        game.getWinner.returns([game.players[1]]);

        const compiledGame = gameCompilerService.compile(game);
        expect(compiledGame.winnerIndex[0]).to.equal(1);
    });
});
