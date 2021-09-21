import { Letter } from '@app/GameLogic/game/letter.interface';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { Bot } from './bot';

class TestBot extends Bot {}

describe('Bot', () => {
    let bot: TestBot;

    beforeEach(() => {
        bot = new TestBot('Jimmy', new BoardService(), new DictionaryService());
    });
    it('should create an instance', () => {
        expect(bot).toBeTruthy();
    });

    it('should split a given line in all possible combination hello', () => {
        let testLine = new ValidWord('hello');
        let result: ValidWord[];
        let expected: ValidWord[] = [];

        expected.push(new ValidWord('hello', 0, 0, 0, 0, false));

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination hel-o', () => {
        let testLine = new ValidWord('hel-o');
        let result: ValidWord[];
        let expected: ValidWord[] = [];

        expected.push(new ValidWord('hel', 0, 0, 0, 0, false));
        expected.push(new ValidWord('o', 0, 0, 0, 0, false));
        expected.push(new ValidWord('hel-o', 0, 0, 0, 0));

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination test-ng---hello', () => {
        let testLine = new ValidWord('test-ng---hello', 0, 0, 8, 4);
        let result: ValidWord[];
        let expected: ValidWord[] = [];

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
        let testLine = new ValidWord('super-cali--fragi---listic----expiali-----docious');
        let result: ValidWord[];
        let expected: number = 21;

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
        let testLine = 'oa';
        let testWord = new ValidWord('keyboard');
        let letters: Letter[] = [
            { char: 'y', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        let result: boolean;
        let expected: boolean = true;

        result = bot.regexCheck(testWord, testLine);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (simple false)', () => {
        let testLine = 'oa';
        let testWord = new ValidWord('keyboard');
        let letters: Letter[] = [
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        let result: boolean;
        let expected: boolean = false;

        result = bot.regexCheck(testWord, testLine);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex true)', () => {
        let testLine = 'y--a';
        let testWord = new ValidWord('keyboard');
        let letters: Letter[] = [
            { char: 'o', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        let result: boolean;
        let expected: boolean = true;

        result = bot.regexCheck(testWord, testLine);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex false)', () => {
        let testLine = 'y--a';
        let testWord = new ValidWord('keyboard');
        let letters: Letter[] = [
            { char: 'o', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        let result: boolean;
        let expected: boolean = false;

        result = bot.regexCheck(testWord, testLine);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex+ true)', () => {
        let testLine = 'y--a--s';
        let testWord = new ValidWord('keyboards');
        let letters: Letter[] = [
            { char: 'o', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        let result: boolean;
        let expected: boolean = true;

        result = bot.regexCheck(testWord, testLine);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex+ false)', () => {
        let testLine = 'y--a--s';
        let testWord = new ValidWord('keyboardss');
        let letters: Letter[] = [
            { char: 'o', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        let result: boolean;
        let expected: boolean = false;

        result = bot.regexCheck(testWord, testLine);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex+ false)', () => {
        let testLine = 'y--a--s';
        let testWord = new ValidWord('kkeyboardss');
        let letters: Letter[] = [
            { char: 'o', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        let result: boolean;
        let expected: boolean = false;

        result = bot.regexCheck(testWord, testLine);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex+ false)', () => {
        let testLine = 'y--a--s';
        let testWord = new ValidWord('keybardss');
        let letters: Letter[] = [
            { char: 'o', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'b', value: 1 },
            { char: 'r', value: 1 },
            { char: 'k', value: 1 },
        ];
        bot.letterRack = letters;
        let result: boolean;
        let expected: boolean = false;

        result = bot.regexCheck(testWord, testLine);
        expect(result).toEqual(expected);
    });
});

// TODO Make more tests
