/* eslint-disable @typescript-eslint/no-magic-numbers*/
import { TestBed } from '@angular/core/testing';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { EasyBot } from '@app/GameLogic/player/easy-bot';
import { HORIZONTAL, ValidWord, VERTICAL } from '@app/GameLogic/player/valid-word';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';

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

describe('BotCrawler1', () => {
    const dict = new DictionaryService();
    const board = new BoardService();
    const pointCalc = new PointCalculatorService(board);
    const wordVal = new WordSearcher(board, dict);
    const botMessageMock = jasmine.createSpyObj('BotMessageService', ['sendAction']);
    const gameInfo = new GameInfoService(new TimerService());
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute']);
    let bot: EasyBot;

    TestBed.configureTestingModule({
        providers: [{ provide: DictionaryService, useValue: dict }],
    });
    beforeAll(() => {
        bot = new EasyBot('test', board, dict, pointCalc, wordVal, botMessageMock, gameInfo, commandExecuterMock);
    });

    it('should create an instance', () => {
        expect(bot.botCrawler).toBeTruthy();
    });

    it('should split a given line in all possible combination hello', () => {
        const testLine = new ValidWord('hello');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hello'));

        result = bot.botCrawler.getAllPossibilitiesOnLine(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination hel-o', () => {
        const testLine = new ValidWord('hel-o');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hel', 0, 0, 0, 0, false));
        expected.push(new ValidWord('o', 0, 0, 0, 0, false, 4));
        expected.push(new ValidWord('hel-o', 0, 0, 0, 0));

        result = bot.botCrawler.getAllPossibilitiesOnLine(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination test-ng---hello', () => {
        const testLine = new ValidWord('test-ng---hello', 0, 0, 8, 4, VERTICAL);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('test', 0, 0, 8, 0, VERTICAL));
        expected.push(new ValidWord('ng', 0, 0, 0, 2, VERTICAL, 0, 5));
        expected.push(new ValidWord('hello', 0, 0, 2, 4, VERTICAL, 0, 10));
        expected.push(new ValidWord('test-ng', 0, 0, 8, 2, VERTICAL));
        expected.push(new ValidWord('ng---hello', 0, 0, 0, 4, VERTICAL, 0, 5));
        expected.push(new ValidWord('test-ng---hello', 0, 0, 8, 4, VERTICAL));

        result = bot.botCrawler.getAllPossibilitiesOnLine(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination supercalifrafilisticexpialidocious', () => {
        const testLine = new ValidWord('super-cali--fragi---listic----expiali-----docious');
        let result: ValidWord[] = [];
        const expected = 21; // It would take too long to list all the possibilities with any more details in this test.

        result = bot.botCrawler.getAllPossibilitiesOnLine(testLine);
        expect(result.length).toEqual(expected);
    });
});

describe('BotCrawler2', () => {
    const dict = new DictionaryService();
    const botMessageMock = jasmine.createSpyObj('BotMessageService', ['sendAction']);
    const gameInfo = new GameInfoService(new TimerService());
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute']);
    let bot: EasyBot;
    let boardService: BoardService;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: dict }, BotCreatorService],
        });
        boardService = TestBed.inject(BoardService);
        const pointCalc = new PointCalculatorService(boardService);
        const wordVal = new WordSearcher(boardService, dict);
        bot = new EasyBot('test', boardService, dict, pointCalc, wordVal, botMessageMock, gameInfo, commandExecuterMock);
    });

    it('should return a list of all validWord the bot can play', () => {
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
        placeTestWords(7, 6, true, 'tabac', boardService);

        let result: ValidWord[] = [];
        const expected = 143; // It would take too long to list all the possibilities with any more details in this test.
        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (empty board))', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: '*', value: 1 },
        ];
        bot.letterRack = letters;

        let result: ValidWord[] = [];
        const expected = 54; // It would take too long to list all the possibilities with any more details in this test.
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
            { char: 'A', value: 1 },
            { char: '*', value: 1 },
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
            { char: 'A', value: 1 },
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
