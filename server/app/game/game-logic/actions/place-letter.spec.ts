import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { Direction } from '@app/game/game-logic/actions/direction.enum';
import { PlaceLetter } from '@app/game/game-logic/actions/place-letter';
import { LetterCreator } from '@app/game/game-logic/board/letter-creator';
import { Tile } from '@app/game/game-logic/board/tile';
import { DEFAULT_TIME_PER_TURN } from '@app/game/game-logic/constants';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { EndOfGame } from '@app/game/game-logic/interface/end-of-game.interface';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { PlacementSetting } from '@app/game/game-logic/interface/placement-setting.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { isCharUpperCase } from '@app/game/game-logic/utils';
import { WordSearcher } from '@app/game/game-logic/validator/word-search/word-searcher.service';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';
import { Subject } from 'rxjs';
import { SinonFakeTimers, useFakeTimers } from 'sinon';

describe('PlaceLetter', () => {
    const lettersToPlace = 'bateau';
    const placement: PlacementSetting = {
        x: 0,
        y: 0,
        direction: Direction.Horizontal,
    };
    let game: ServerGame;
    const player1: Player = new Player('Tim');
    const player2: Player = new Player('George');
    let placeLetter: PlaceLetter;
    let activePlayer: Player;
    let letterCreator: LetterCreator;
    const pointCalculatorStub = createSinonStubInstance<PointCalculatorService>(PointCalculatorService);
    const wordSearcherStub = createSinonStubInstance<WordSearcher>(WordSearcher);
    const randomBonus = false;
    const gameCompiler = createSinonStubInstance<GameCompiler>(GameCompiler);
    const mockNewGameState$ = new Subject<GameStateToken>();
    const messagesService = createSinonStubInstance<SystemMessagesService>(SystemMessagesService);
    const timerController = createSinonStubInstance<TimerController>(TimerController);
    let clock: SinonFakeTimers;
    const mockEndGame$ = new Subject<EndOfGame>();
    beforeEach(() => {
        clock = useFakeTimers();
        wordSearcherStub.listOfValidWord.returns([{ letters: [new Tile()], index: [0] }]);
        pointCalculatorStub.placeLetterCalculation.callsFake((action, listOfWord) => {
            const points = action.word.length + listOfWord.length;
            const player = action.player;
            player.points = points;
            return points;
        });
        game = new ServerGame(
            timerController,
            randomBonus,
            DEFAULT_TIME_PER_TURN,
            'default_gameToken',
            pointCalculatorStub,
            gameCompiler,
            messagesService,
            mockNewGameState$,
            mockEndGame$,
        );
        game.players.push(player1);
        game.players.push(player2);
        game.start();
        letterCreator = new LetterCreator();
        const letterObjects = letterCreator.createLetters(lettersToPlace.split(''));
        activePlayer = game.getActivePlayer();
        for (let i = 0; i < letterObjects.length; i++) {
            activePlayer.letterRack[i] = letterObjects[i];
        }
        placeLetter = new PlaceLetter(activePlayer, lettersToPlace, placement, pointCalculatorStub, wordSearcherStub);
    });

    afterEach(() => {
        clock.restore();
    });

    it('should place letter at right place', () => {
        placeLetter.execute(game);
        for (let i = 0; i < lettersToPlace.length; i++) {
            expect(game.board.grid[0][i].letterObject.char).to.equal(lettersToPlace.charAt(i).toUpperCase());
        }
    });

    it('should have proper revert behavior', async () => {
        wordSearcherStub.listOfValidWord.returns([]);
        const TIME_BEFORE_REVERT = 3000;
        placeLetter.execute(game);
        clock.tick(TIME_BEFORE_REVERT);
        for (let i = 0; i < lettersToPlace.length; i++) {
            expect(game.board.grid[i][0].letterObject.char).to.equal(' ');
        }
    });

    it('should add points when action valid', () => {
        const LIST_OF_WORD_LENGTH = 1;
        const points = placeLetter.word.length + LIST_OF_WORD_LENGTH;
        placeLetter.execute(game);
        activePlayer = game.getActivePlayer();
        expect(activePlayer.points).to.equal(points);
    });

    it('#isCharUpperCase should throw error', () => {
        const notChar = 'AB';
        expect(() => {
            isCharUpperCase(notChar);
        }).to.throws();
    });

    it('should place letters in vertical', () => {
        const newPlacement = { ...placement };
        newPlacement.direction = Direction.Vertical;
        placeLetter = new PlaceLetter(activePlayer, lettersToPlace, newPlacement, pointCalculatorStub, wordSearcherStub);
        placeLetter.execute(game);

        const word = placeLetter.word;
        for (let y = 0; y < word.length; y++) {
            expect(game.board.grid[y][0].letterObject.char).to.equal(word.charAt(y).toUpperCase());
        }
    });

    it('should place blank letter', () => {
        activePlayer.letterRack[0] = letterCreator.createLetter('*');
        const wordToPlace = 'Bateau';
        placeLetter = new PlaceLetter(activePlayer, wordToPlace, placement, pointCalculatorStub, wordSearcherStub);
        placeLetter.execute(game);

        const word = placeLetter.word;
        for (let x = 0; x < word.length; x++) {
            expect(game.board.grid[0][x].letterObject.char).to.equal(word.charAt(x).toUpperCase());
        }
    });

    it('should place letter at right place with letters on board', () => {
        game.board.grid[0][0].letterObject = letterCreator.createLetter('B');
        placeLetter.execute(game);
        for (let i = 0; i < lettersToPlace.length; i++) {
            expect(game.board.grid[0][i].letterObject.char).to.equal(lettersToPlace.charAt(i).toUpperCase());
        }
    });
});
