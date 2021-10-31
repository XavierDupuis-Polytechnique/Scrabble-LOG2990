import { Direction } from '@app/game/game-logic/actions/direction.enum';
import { PlaceLetter } from '@app/game/game-logic/actions/place-letter';
import { LetterCreator } from '@app/game/game-logic/board/letter-creator';
import { Tile } from '@app/game/game-logic/board/tile';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { PlacementSetting } from '@app/game/game-logic/interface/placement-setting.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { isCharUpperCase } from '@app/game/game-logic/utils';
import { WordSearcher } from '@app/game/game-logic/validator/word-search/word-searcher.service';
import { SystemMessagesService } from '@app/messages-service/system-messages.service';
import { GameCompiler } from '@app/services/game-compiler.service';
import { expect } from 'chai';
import { Subject } from 'rxjs';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

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
    let pointCalculatorStub: SinonStubbedInstance<PointCalculatorService>;
    let wordSearcherStub: SinonStubbedInstance<WordSearcher>;
    const randomBonus = false;
    const gameCompiler = new GameCompiler();
    const mockNewGameState$ = new Subject<GameStateToken>();
    const messagesService = new SystemMessagesService();

    beforeEach(() => {
        wordSearcherStub = createStubInstance(WordSearcher);
        wordSearcherStub.listOfValidWord.returns([{ letters: [new Tile()], index: [0] }]);
        pointCalculatorStub = createStubInstance(PointCalculatorService);
        pointCalculatorStub.placeLetterCalculation.callsFake((action, listOfWord) => {
            const points = action.word.length + listOfWord.length;
            const player = action.player;
            player.points = points;
            return points;
        });
        game = new ServerGame(
            new TimerController(),
            randomBonus,
            60000,
            'default_gameToken',
            pointCalculatorStub,
            gameCompiler,
            messagesService,
            mockNewGameState$,
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

    it('should place letter at right place', () => {
        placeLetter.execute(game);
        for (let i = 0; i < lettersToPlace.length; i++) {
            expect(game.board.grid[0][i].letterObject.char).to.equal(lettersToPlace.charAt(i).toUpperCase());
        }
    });

    // it('should have proper revert behavior', async () => {
    //     const TIME_BEFORE_REVERT = 3000;
    //     (wordSearcher as MockwordSearcherStub).validity = false;
    //     placeLetter.execute(game);
    //     tick(TIME_BEFORE_REVERT);
    //     for (let i = 0; i < lettersToPlace.length; i++) {
    //         expect(game.board.grid[i][0].letterObject.char).to.equal(' ');
    //     }
    // });

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
