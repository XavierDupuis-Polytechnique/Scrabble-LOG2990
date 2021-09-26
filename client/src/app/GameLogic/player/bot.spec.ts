/* eslint-disable @typescript-eslint/no-magic-numbers*/
/* eslint-disable max-classes-per-file*/
import { Board } from '@app/GameLogic/game/board';
import { Game } from '@app/GameLogic/game/games/game';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { Bot } from './bot';

class TestBot extends Bot {
    setActive() {
        this.startTimerAction();
        // TODO: Start computation for picking actions
    }
}
class TestBoard extends Board {
    letterCreator = new LetterCreator();
    placeWord(x: number, y: number, isVertical: boolean, word: string) {
        for (const letter of word) {
            this.grid[y][x].letterObject = this.letterCreator.createLetter(letter);
            if (isVertical) {
                y++;
            } else {
                x++;
            }
        }
    }
}

describe('Bot', () => {
    let bot: TestBot;
    let board: TestBoard;
    const boardService = new BoardService();
    const dictionaryService = new DictionaryService();
    const pointCalculator = new PointCalculatorService(boardService);
    const timer = new TimerService();
    const game = new Game(10, timer, pointCalculator, boardService);

    beforeEach(() => {
        // bot = new TestBot('Jimmy', boardService, dictionaryService, pointCalculator, game);
        bot = new TestBot('Jimmy', boardService, dictionaryService, game);
        board = new TestBoard();
    });
    it('should create an instance', () => {
        expect(bot).toBeTruthy();
    });

    it('should split a given line in all possible combination hello', () => {
        const testLine = new ValidWord('hello');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hello'));

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination hel-o', () => {
        const testLine = new ValidWord('hel-o');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hel', 0, 0, 0, 0, false));
        expected.push(new ValidWord('o', 0, 0, 0, 0, false, 4));
        expected.push(new ValidWord('hel-o', 0, 0, 0, 0));

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination test-ng---hello', () => {
        const testLine = new ValidWord('test-ng---hello', 0, 0, 8, 4);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('test', 0, 0, 8, 0, false));
        expected.push(new ValidWord('ng', 0, 0, 0, 2, false, 5));
        expected.push(new ValidWord('hello', 0, 0, 2, 4, false, 10));
        expected.push(new ValidWord('test-ng', 0, 0, 8, 2, false));
        expected.push(new ValidWord('ng---hello', 0, 0, 0, 4, false, 5));
        expected.push(new ValidWord('test-ng---hello', 0, 0, 8, 4, false));

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination supercalifrafilisticexpialidocious', () => {
        const testLine = new ValidWord('super-cali--fragi---listic----expiali-----docious');
        let result: ValidWord[] = [];
        const expected = 21; // It would take too long to list all the possibilities with any more details in this test.

        result = bot.lineSplitter(testLine);
        expect(result.length).toEqual(expected);
    });

    // TODO Move regexCheck to dictionaryService.spec.ts
    it('should check if its possible to form the word keyboard with the available letters (simple true)', () => {
        const testLine = 'oa';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'Y', value: 1 },
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
            { char: 'Z', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = true;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (simple false)', () => {
        const testLine = 'oa';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
            { char: 'Z', value: 1 },
            { char: 'X', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = false;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex true)', () => {
        const testLine = 'y--a';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'O', value: 1 },
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
            { char: 'Z', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = true;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex false)', () => {
        const testLine = 'y--a';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'O', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
            { char: 'Z', value: 1 },
            { char: 'X', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = false;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboards with the available letters (complex+ true)', () => {
        const testLine = 'y--a--s';
        const testWord = new ValidWord('keyboards');
        const letters: Letter[] = [
            { char: 'O', value: 1 },
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = true;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex+ false)', () => {
        const testLine = 'y--a--s';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
            { char: 'Z', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
            { char: 'X', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = false;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    // TODO Change the test word
    it('should check if its possible to form the word keyboard with the available letters (double letters false)', () => {
        const testLine = 'y--a--s';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'O', value: 1 },
            { char: 'O', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = false;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    // TODO Change the test word
    it('should check if its possible to form the word keyboard with the available letters (double letter true)', () => {
        const testLine = 'y--a--s';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'O', value: 1 },
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'O', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = false;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word skippassent with the available letters (double letter true)', () => {
        const testLine = 'ki--as--tn';
        const testWord = new ValidWord('skippassent');
        const letters: Letter[] = [
            { char: 'S', value: 1 },
            { char: 'P', value: 1 },
            { char: 'P', value: 1 },
            { char: 'S', value: 1 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'Z', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = false;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (simple board))', () => {
        const letters: Letter[] = [
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        bot.letterRack = letters;
        board.placeWord(6, 7, false, 'bateaux');
        board.placeWord(9, 7, true, 'elle');
        boardService.board.grid = board.grid;
        let result: ValidWord[] = [];
        // TODO change number when crosscheck works
        const expected: number = 238; // It would take too long to list all the possibilities with any more details in this test.

        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (complex board))', () => {
        const letters: Letter[] = [
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        bot.letterRack = letters;

        board.placeWord(5, 7, false, 'vitrat');
        board.placeWord(0, 3, true, 'bateaux');
        board.placeWord(11, 3, true, 'elle');
        board.placeWord(0, 3, false, 'bondonneraient');
        board.placeWord(5, 3, true, 'nativement');
        board.placeWord(4, 10, false, 'retarderons');
        board.placeWord(9, 3, true, 'abacas');
        board.placeWord(2, 3, true, 'nageait');
        board.placeWord(4, 1, true, 'oxo');
        board.placeWord(13, 3, true, 'tabac');
        board.placeWord(4, 1, false, 'occlusion');
        board.placeWord(0, 12, false, 'romantismes');

        boardService.board.grid = board.grid;
        let result: ValidWord[] = [];
        // TODO change number when crosscheck works
        const expected: number = 590; // It would take too long to list all the possibilities with any more details in this test.

        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (empty board))', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        bot.letterRack = letters;

        boardService.board.grid = board.grid;
        let result: ValidWord[] = [];
        // TODO change number when crosscheck works
        const expected: number = 1372; // It would take too long to list all the possibilities with any more details in this test.
        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });
});

// TODO Make more tests
