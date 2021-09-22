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

class TestBot extends Bot {}
class TestBoard extends Board {
    letterCreator = new LetterCreator();
    placeWord(x: number, y: number, isVertical: boolean, word: string) {
        for (const letter of word) {
            this.grid[x][y].letterObject = this.letterCreator.createLetter(letter);
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
    const pointCalculator = new PointCalculatorService();
    const timer = new TimerService();
    const game = new Game(10, timer, pointCalculator, boardService);

    beforeEach(() => {
        bot = new TestBot('Jimmy', boardService, dictionaryService, pointCalculator, game);
        board = new TestBoard();
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
        board.placeWord(6, 8, false, 'bateaux');
        board.placeWord(9, 8, true, 'elle');
        boardService.board.grid = board.grid;
        let result: ValidWord[] = [];
        //const expected: number = 536;
        const expected: ValidWord[] = [];

        result = bot.bruteForceStart();
        expect(result).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (complex board))', () => {
        const letters: Letter[] = [
            { char: 'e', value: 1 },
            { char: 'k', value: 1 },
            { char: 'o', value: 1 },
            { char: 'i', value: 1 },
            { char: 'n', value: 1 },
            { char: 'j', value: 1 },
            { char: 'l', value: 1 },
            // { char: 'a', value: 1 },
            // { char: 'e', value: 1 },
            // { char: 'i', value: 1 },
            // { char: 'o', value: 1 },
            // { char: 'u', value: 1 },
            // { char: 't', value: 1 },
            // { char: 'b', value: 1 },
        ];
        // bateaux elle bondonneraient nativement retarderons abacas nageait oxo tabac occlusion romantismes
        bot.letterRack = letters;

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


        // board.placeWord(6, 8, true, 'bondonneraient');
        boardService.board.grid = board.grid;
        let result: ValidWord[] = [];
        // const expected: number = 1;
        const expected: ValidWord[] = [];

        result = bot.bruteForceStart();
        expect(result).toEqual(expected);
    });
});

// TODO Make more tests
