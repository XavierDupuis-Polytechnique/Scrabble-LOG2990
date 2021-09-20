import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { Bot } from './bot';

class MockedBot extends Bot {}

describe('Bot', () => {
    let bot: MockedBot;

    beforeEach(() => {
        bot = new MockedBot('Jimmy', new BoardService(), new DictionaryService());
    });
    it('should create an instance', () => {
        expect(bot).toBeTruthy();
    });

    it('should split a given line in all possible combination', () => {
        let testLine = 'hello';
        let result: string[];
        let expected: string[] = [];

        expected.push('hello');

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination', () => {
        let testLine = 'hel-o';
        let result: string[];
        let expected: string[] = [];

        expected.push('hel');
        expected.push('o');
        expected.push('hel-o');

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination', () => {
        let testLine = 'test-ng---hello';
        let result: string[];
        let expected: string[] = [];

        expected.push('test');
        expected.push('ng');
        expected.push('hello');
        expected.push('test-ng');
        expected.push('ng---hello');
        expected.push('test-ng---hello');

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination', () => {
        let testLine = 'super-cali--fragi---listic----expiali-----docious';
        let result: string[];
        let expected: string[] = [];

        expected.push('super');
        expected.push('cali');
        expected.push('fragi');
        expected.push('listic');
        expected.push('expiali');
        expected.push('docious');
        expected.push('super-cali');
        expected.push('cali--fragi');
        expected.push('fragi---listic');
        expected.push('listic----expiali');
        expected.push('expiali-----docious');
        expected.push('super-cali--fragi');
        expected.push('cali--fragi---listic');
        expected.push('fragi---listic----expiali');
        expected.push('listic----expiali-----docious');
        expected.push('super-cali--fragi---listic');
        expected.push('cali--fragi---listic----expiali');
        expected.push('fragi---listic----expiali-----docious');
        expected.push('super-cali--fragi---listic----expiali');
        expected.push('cali--fragi---listic----expiali-----docious');
        expected.push('super-cali--fragi---listic----expiali-----docious');

        result = bot.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });
});

// TODO Make more tests
