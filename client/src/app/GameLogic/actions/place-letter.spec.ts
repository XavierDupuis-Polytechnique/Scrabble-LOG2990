import { Injectable } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { DEFAULT_TIME_PER_TURN } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { Tile } from '@app/GameLogic/game/board/tile';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { PlacementSetting } from '@app/GameLogic/interface/placement-setting.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { isCharUpperCase } from '@app/GameLogic/utils';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { Word } from '@app/GameLogic/validator/word-search/word';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
@Injectable()
class MockWordSearcher extends WordSearcher {
    validity = true;
    listOfValidWord(): Word[] {
        if (this.validity) {
            return [{ letters: [new Tile()], index: [0] }];
        }
        return [];
    }
}

describe('PlaceLetter', () => {
    let timer: TimerService;
    const lettersToPlace = 'bateau';
    const placement: PlacementSetting = {
        x: 0,
        y: 0,
        direction: Direction.Horizontal,
    };
    let game: Game;
    const player1: Player = new User('Tim');
    const player2: Player = new User('George');
    let wordSearcher: WordSearcher;
    let placeLetter: PlaceLetter;
    let activePlayer: Player;
    let letterCreator: LetterCreator;
    let pointCalculatorSpy: PointCalculatorService;
    const dict = new DictionaryService();
    const randomBonus = false;
    beforeEach(() => {
        timer = new TimerService();
        pointCalculatorSpy = jasmine.createSpyObj('PointCalculatorService', ['placeLetterCalculation']);
        pointCalculatorSpy.placeLetterCalculation = jasmine.createSpy().and.callFake((action, listOfWord) => {
            const points = action.word.length + listOfWord.length;
            const player = action.player;
            player.points = points;
            return points;
        });
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                BoardService,
                { provide: PointCalculatorService, useValue: pointCalculatorSpy },
                { provide: WordSearcher, useClass: MockWordSearcher },
                GameInfoService,
                MessagesService,
            ],
        });
        const boardService = TestBed.inject(BoardService);
        const messages = TestBed.inject(MessagesService);
        const dictionaryService = TestBed.inject(DictionaryService);
        wordSearcher = new MockWordSearcher(boardService, dictionaryService);
        game = new Game(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculatorSpy, boardService, messages);
        game.players.push(player1);
        game.players.push(player2);
        game.start();
        letterCreator = new LetterCreator();
        const letterObjects = letterCreator.createLetters(lettersToPlace.split(''));
        activePlayer = game.getActivePlayer();
        for (let i = 0; i < letterObjects.length; i++) {
            activePlayer.letterRack[i] = letterObjects[i];
        }
        placeLetter = new PlaceLetter(activePlayer, lettersToPlace, placement, pointCalculatorSpy, wordSearcher);
    });

    it('should create an instance', () => {
        activePlayer = game.getActivePlayer();
        expect(new PlaceLetter(activePlayer, lettersToPlace, placement, pointCalculatorSpy, wordSearcher)).toBeTruthy();
    });

    it('should place letter at right place', () => {
        placeLetter.execute(game);
        for (let i = 0; i < lettersToPlace.length; i++) {
            expect(game.board.grid[0][i].letterObject.char).toBe(lettersToPlace.charAt(i).toUpperCase());
        }
    });

    it('should have proper revert behavior', fakeAsync(() => {
        const TIME_BEFORE_REVERT = 3000;
        (wordSearcher as MockWordSearcher).validity = false;
        placeLetter.execute(game);
        tick(TIME_BEFORE_REVERT);
        for (let i = 0; i < lettersToPlace.length; i++) {
            expect(game.board.grid[i][0].letterObject.char).toBe(' ');
        }
    }));

    it('should add points when action valid', () => {
        const LIST_OF_WORD_LENGTH = 1;
        const points = placeLetter.word.length + LIST_OF_WORD_LENGTH;
        placeLetter.execute(game);
        activePlayer = game.getActivePlayer();
        expect(activePlayer.points).toBe(points);
    });

    it('#isCharUpperCase should throw error', () => {
        const notChar = 'AB';
        expect(() => {
            isCharUpperCase(notChar);
        }).toThrowError();
    });

    it('should place letters in vertical', () => {
        const newPlacement = { ...placement };
        newPlacement.direction = Direction.Vertical;
        placeLetter = new PlaceLetter(activePlayer, lettersToPlace, newPlacement, pointCalculatorSpy, wordSearcher);
        placeLetter.execute(game);

        const word = placeLetter.word;
        for (let y = 0; y < word.length; y++) {
            expect(game.board.grid[y][0].letterObject.char).toBe(word.charAt(y).toUpperCase());
        }
    });

    it('should place blank letter', () => {
        activePlayer.letterRack[0] = letterCreator.createLetter('*');
        const wordToPlace = 'Bateau';
        placeLetter = new PlaceLetter(activePlayer, wordToPlace, placement, pointCalculatorSpy, wordSearcher);
        placeLetter.execute(game);

        const word = placeLetter.word;
        for (let x = 0; x < word.length; x++) {
            expect(game.board.grid[0][x].letterObject.char).toBe(word.charAt(x).toUpperCase());
        }
    });

    it('should place letter at right place with letters on board', () => {
        game.board.grid[0][0].letterObject = letterCreator.createLetter('B');
        placeLetter.execute(game);
        for (let i = 0; i < lettersToPlace.length; i++) {
            expect(game.board.grid[0][i].letterObject.char).toBe(lettersToPlace.charAt(i).toUpperCase());
        }
    });
});
