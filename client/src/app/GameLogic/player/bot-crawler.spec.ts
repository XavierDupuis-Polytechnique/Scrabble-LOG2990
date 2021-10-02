/* eslint-disable @typescript-eslint/no-magic-numbers*/
import { TestBed } from '@angular/core/testing';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { EasyBot } from '@app/GameLogic/player/easy-bot';
import { HORIZONTAL, ValidWord, VERTICAL } from '@app/GameLogic/player/valid-word';

const placeTestWords = (x: number, y: number, isVertical: boolean, word: string, boardService: BoardService) => {
    const letterCreator = new LetterCreator();
    for (const letter of word) {
        boardService.board.grid[y][x].letterObject = letterCreator.createLetter(letter);
        if (isVertical) {
            y++;
        } else {
            x++;
        }
    }
};

describe('BotCrawler', () => {
    TestBed.configureTestingModule({
        providers: [BoardService, BotCreatorService],
    });
    let bot: EasyBot;
    let boardService: BoardService;
    let botCreator: BotCreatorService;

    beforeEach(() => {
        botCreator = TestBed.inject(BotCreatorService);
        boardService = TestBed.inject(BoardService);
        bot = botCreator.createBot('testBot', 'easy') as EasyBot;
    });

    it('should create an instance', () => {
        expect(bot.botCrawler).toBeTruthy();
    });

    it('should split a given line in all possible combination hello', () => {
        const testLine = new ValidWord('hello');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hello'));

        result = bot.botCrawler.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination hel-o', () => {
        const testLine = new ValidWord('hel-o');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hel', 0, 0, 0, 0, false));
        expected.push(new ValidWord('o', 0, 0, 0, 0, false, 4));
        expected.push(new ValidWord('hel-o', 0, 0, 0, 0));

        result = bot.botCrawler.lineSplitter(testLine);
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

        result = bot.botCrawler.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination supercalifrafilisticexpialidocious', () => {
        const testLine = new ValidWord('super-cali--fragi---listic----expiali-----docious');
        let result: ValidWord[] = [];
        const expected = 21; // It would take too long to list all the possibilities with any more details in this test.

        result = bot.botCrawler.lineSplitter(testLine);
        expect(result.length).toEqual(expected);
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
        placeTestWords(6, 7, false, 'bateaux', boardService);
        placeTestWords(9, 7, true, 'elle', boardService);

        let result: ValidWord[] = [];
        const expected = 243; // It would take too long to list all the possibilities with any more details in this test.
        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (complex board))', () => {
        const letters: Letter[] = [
            { char: '*', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        bot.letterRack = letters;

        placeTestWords(5, 7, false, 'vitrat', boardService);
        placeTestWords(0, 3, true, 'bateaux', boardService);
        placeTestWords(11, 3, true, 'elle', boardService);
        placeTestWords(0, 3, false, 'bondonneraient', boardService);
        placeTestWords(5, 3, true, 'nativement', boardService);
        placeTestWords(4, 10, false, 'retarderons', boardService);
        placeTestWords(9, 3, true, 'abacas', boardService);
        placeTestWords(2, 3, true, 'nageait', boardService);
        placeTestWords(4, 1, true, 'oxo', boardService);
        placeTestWords(13, 3, true, 'tabac', boardService);
        placeTestWords(4, 1, false, 'occlusion', boardService);
        placeTestWords(0, 12, false, 'romantismes', boardService);

        let result: ValidWord[] = [];
        const expected = 1743; // It would take too long to list all the possibilities with any more details in this test.

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

        let result: ValidWord[] = [];
        const expected = 1959; // It would take too long to list all the possibilities with any more details in this test.
        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (edge case bug fixing test))', () => {
        const letters: Letter[] = [
            { char: 'L', value: 1 },
            { char: 'J', value: 1 },
            { char: 'R', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'E', value: 1 },
            { char: 'S', value: 1 },
        ];
        bot.letterRack = letters;

        placeTestWords(5, 7, false, 'etre', boardService);

        let result: ValidWord[] = [];
        const expected = 388; // It would take too long to list all the possibilities with any more details in this test.

        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });

    it('should return a list of vertical validWords (empty board))', () => {
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
        spyOn(bot, 'getRandomInt').and.returnValue(1);

        bot.bruteForceStart();
        const result: ValidWord[] = bot.validWordList;
        const expected = VERTICAL;

        expect(result[0].isVertical).toEqual(expected);
    });

    it('should return a list of horizontal validWords (empty board))', () => {
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
        spyOn(bot, 'getRandomInt').and.returnValue(0);

        bot.bruteForceStart();
        const result: ValidWord[] = bot.validWordList;
        const expected = HORIZONTAL;

        expect(result[0].isVertical).toEqual(expected);
    });

    it('should stop the first turn algo when timesUp', () => {
        const letters: Letter[] = [
            { char: 'L', value: 1 },
            { char: 'J', value: 1 },
            { char: 'R', value: 1 },
            { char: '*', value: 1 },
            { char: 'I', value: 1 },
            { char: '*', value: 1 },
            { char: 'S', value: 1 },
        ];
        bot.letterRack = letters;

        let result: ValidWord[] = [];
        const expected = 0;
        bot.timesUp = true;
        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });

    it('should stop the algo when timesUp', () => {
        const letters: Letter[] = [
            { char: 'L', value: 1 },
            { char: 'J', value: 1 },
            { char: 'R', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'E', value: 1 },
            { char: 'S', value: 1 },
        ];
        bot.letterRack = letters;

        placeTestWords(5, 7, false, 'etre', boardService);

        let result: ValidWord[] = [];
        const expected = 0;
        bot.timesUp = true;
        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });
});
