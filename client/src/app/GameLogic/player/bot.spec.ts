/* eslint-disable @typescript-eslint/no-magic-numbers*/
/* eslint-disable max-classes-per-file*/
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { Bot } from './bot';

class TestBot extends Bot {}
class MockBoard {
    grid: Tile[][];
    constructor() {
        this.grid = [];
        for (let i = 0; i < 5; i++) {
            this.grid[i] = [];
            for (let j = 0; j < 5; j++) {
                this.grid[i][j] = new Tile();
                this.grid[i][j].letterObject = { char: ' ', value: 1 };
            }
        }

        this.grid[6][7].letterObject = { char: 'B', value: 1 };
        this.grid[7][7].letterObject = { char: 'A', value: 1 };
        this.grid[8][7].letterObject = { char: 'T', value: 1 };
        this.grid[9][7].letterObject = { char: 'E', value: 1 };
        this.grid[10][7].letterObject = { char: 'A', value: 1 };
        this.grid[11][7].letterObject = { char: 'U', value: 1 };
        this.grid[12][7].letterObject = { char: 'X', value: 1 };

        this.grid[9][8].letterObject = { char: 'L', value: 1 };
        this.grid[9][9].letterObject = { char: 'L', value: 1 };
        this.grid[9][10].letterObject = { char: 'E', value: 1 };
    }
}

describe('Bot', () => {
    let bot: TestBot;
    const boardService = new BoardService();
    const dictionaryService = new DictionaryService();
    const mockBoard = new MockBoard();

    beforeEach(() => {
        bot = new TestBot('Jimmy', boardService, new DictionaryService(), new PointCalculatorService());
    });
    it('should create an instance', () => {
        expect(bot).toBeTruthy();
    });

    it('should split a given line in all possible combination hello', () => {
        const testLine = new ValidWord('hello');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hello', 0, 0, 0, 0, false));

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination hel-o', () => {
        const testLine = new ValidWord('hel-o');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hel', 0, 0, 0, 0, false));
        expected.push(new ValidWord('o', 0, 0, 0, 0, false));
        expected.push(new ValidWord('hel-o', 0, 0, 0, 0));

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination test-ng---hello', () => {
        const testLine = new ValidWord('test-ng---hello', 0, 0, 8, 4);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('test', 0, 0, 8, 0, false));
        expected.push(new ValidWord('ng', 0, 0, 0, 2, false));
        expected.push(new ValidWord('hello', 0, 0, 2, 4, false));
        expected.push(new ValidWord('test-ng', 0, 0, 8, 2, false));
        expected.push(new ValidWord('ng---hello', 0, 0, 0, 4, false));
        expected.push(new ValidWord('test-ng---hello', 0, 0, 8, 4, false));

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination supercalifrafilisticexpialidocious', () => {
        const testLine = new ValidWord('super-cali--fragi---listic----expiali-----docious');
        let result: ValidWord[] = [];
        const expected = 21;

        // expected.push('super');
        // expected.push('cali');
        // expected.push('fragi');
        // expected.push('listic');
        // expected.push('expiali');
        // expected.push('docious');
        // expected.push('super-cali');
        // expected.push('cali--fragi');
        // expected.push('fragi---listic');
        // expected.push('listic----expiali');
        // expected.push('expiali-----docious');
        // expected.push('super-cali--fragi');
        // expected.push('cali--fragi---listic');
        // expected.push('fragi---listic----expiali');
        // expected.push('listic----expiali-----docious');
        // expected.push(new ValidWord('super-cali--fragi---listic', 0,0,0,0,false));
        // expected.push(new ValidWord('cali--fragi---listic----expiali', 0,0,0,0,false));
        // expected.push(new ValidWord('fragi---listic----expiali-----docious', 0,0,0,0,false));
        // expected.push(new ValidWord('super-cali--fragi---listic----expiali', 0,0,0,0,false));
        // expected.push(new ValidWord('cali--fragi---listic----expiali-----docious', 0,0,0,0,false));
        // expected.push(new ValidWord('super-cali--fragi---listic----expiali-----docious', 0,0,0,0,false));

        result = bot.lineSplitter(testLine);
        expect(result.length).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (simple true)', () => {
        const testLine = 'oa';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'y', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
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
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
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
            { char: 'o', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
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
            { char: 'o', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = false;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex+ true)', () => {
        const testLine = 'y--a--s';
        const testWord = new ValidWord('keyboards');
        const letters: Letter[] = [
            { char: 'o', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = true;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex+ false)', () => {
        const testLine = 'y--a--s';
        const testWord = new ValidWord('keyboardss');
        const letters: Letter[] = [
            { char: 'o', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = false;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex+ false)', () => {
        const testLine = 'y--a--s';
        const testWord = new ValidWord('kkeyboardss');
        const letters: Letter[] = [
            { char: 'o', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = false;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex+ false)', () => {
        const testLine = 'y--a--s';
        const testWord = new ValidWord('keybardss');
        const letters: Letter[] = [
            { char: 'o', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        const expected = false;

        const result: boolean = dictionaryService.regexCheck(testWord, testLine, bot);
        expect(result).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play)', () => {
        const letters: Letter[] = [
            { char: 'e', value: 1 },
            { char: 'k', value: 1 },
            { char: 'o', value: 1 },
            { char: 'i', value: 1 },
            { char: 'n', value: 1 },
            { char: 'j', value: 1 },
            { char: 'l', value: 1 },
        ];
        bot.letterRack = letters;
        boardService.board.grid = mockBoard.grid;
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];
        // expected.push();

        bot.bruteForceStart();
        result = bot.validWordList;
        expect(result).toEqual(expected);
    });
});

// TODO Make more tests
