/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers*/
import { TestBed } from '@angular/core/testing';
import { ActionCreatorService } from '@app/game-logic/actions/action-creator/action-creator.service';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { LetterCreator } from '@app/game-logic/game/board/letter-creator';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { BotCalculatorService } from '@app/game-logic/player/bot-calculator/bot-calculator.service';
import { BotCreatorService } from '@app/game-logic/player/bot/bot-creator.service';
import { EasyBot } from '@app/game-logic/player/bot/easy-bot';
import { HORIZONTAL, ValidWord, VERTICAL } from '@app/game-logic/player/bot/valid-word';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { BotHttpService, BotType } from '@app/services/bot-http.service';
import { of } from 'rxjs';

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
    const dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['getDictionary']);
    const dict = new DictionaryService(dictHttpServiceMock);
    const botMessageMock = jasmine.createSpyObj('BotMessageService', ['sendAction']);
    const gameInfo = new GameInfoService(new TimerService());
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute']);
    let bot: EasyBot;
    let boardService: BoardService;
    let botCalculator: BotCalculatorService;
    let actionFactory: ActionCreatorService;
    let botHttpService: jasmine.SpyObj<BotHttpService>;

    beforeEach(async () => {
        botHttpService = jasmine.createSpyObj('BotHttpService', ['getDataInfo']);

        const obs = of(['Test1', 'Test2', 'Test3']);
        botHttpService.getDataInfo.and.returnValue(obs);
        await TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: dict }, BotCreatorService, { provide: BotHttpService, useValue: botHttpService }],
        });
        boardService = TestBed.inject(BoardService);
        botCalculator = TestBed.inject(BotCalculatorService);
        actionFactory = TestBed.inject(ActionCreatorService);
        const wordVal = new WordSearcher(boardService, dict);
        bot = new EasyBot(
            'test',
            boardService,
            dict,
            botCalculator,
            wordVal,
            botMessageMock,
            gameInfo,
            commandExecuterMock,
            actionFactory,
            botHttpService,
            BotType.Easy,
        );
    });

    it('should create an instance', () => {
        expect(bot.botCrawler).toBeTruthy();
    });

    it('should split a given line in all possible combination hello', () => {
        const testLine = new ValidWord('hello');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hello'));

        result = bot.botCrawler['getAllPossibilitiesOnLine'](testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination hel-o', () => {
        const testLine = new ValidWord('hel-o');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hel', 0, 0, 0, 0, false));
        expected.push(new ValidWord('o', 0, 0, 0, 0, false, 4));
        expected.push(new ValidWord('hel-o', 0, 0, 0, 0));

        result = bot.botCrawler['getAllPossibilitiesOnLine'](testLine);
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

        result = bot.botCrawler['getAllPossibilitiesOnLine'](testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination supercalifrafilisticexpialidocious', () => {
        const testLine = new ValidWord('super-cali--fragi---listic----expiali-----docious');
        let result: ValidWord[] = [];
        const expected = 21;

        result = bot.botCrawler['getAllPossibilitiesOnLine'](testLine);
        expect(result.length).toEqual(expected);
    });
});

describe('BotCrawler2', () => {
    const dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['getDictionary']);
    const dict = new DictionaryService(dictHttpServiceMock);
    const botMessageMock = jasmine.createSpyObj('BotMessageService', ['sendAction']);
    const gameInfo = new GameInfoService(new TimerService());
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute']);
    let bot: EasyBot;
    let boardService: BoardService;
    let botCalculator: BotCalculatorService;
    let actionFactory: ActionCreatorService;
    let botHttpService: jasmine.SpyObj<BotHttpService>;
    beforeEach(async () => {
        botHttpService = jasmine.createSpyObj('BotHttpService', ['getDataInfo']);

        const obs = of(['Test1', 'Test2', 'Test3']);
        botHttpService.getDataInfo.and.returnValue(obs);
        await TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                BotCreatorService,
                ActionCreatorService,
                { provide: BotHttpService, useValue: botHttpService },
            ],
        });
        boardService = TestBed.inject(BoardService);
        botCalculator = TestBed.inject(BotCalculatorService);
        actionFactory = TestBed.inject(ActionCreatorService);
        const wordVal = new WordSearcher(boardService, dict);

        bot = new EasyBot(
            'test',
            boardService,
            dict,
            botCalculator,
            wordVal,
            botMessageMock,
            gameInfo,
            commandExecuterMock,
            actionFactory,
            botHttpService,
            BotType.Easy,
        );
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
        const expected = 143;
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
        const expected = 54;
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
        const expected = 388;

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
        spyOn<any>(bot, 'getRandomInt').and.returnValue(1);

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
        spyOn<any>(bot, 'getRandomInt').and.returnValue(0);

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

    it('should wuShu, a ghost in the machine (rip the ghost named wushu)', () => {
        const letters: Letter[] = [
            { char: 'H', value: 1 },
            { char: '*', value: 1 },
        ];
        bot.letterRack = letters;
        placeTestWords(7, 7, HORIZONTAL, 'z', boardService);
        placeTestWords(1, 11, HORIZONTAL, 'wu', boardService);
        placeTestWords(5, 11, HORIZONTAL, 'u', boardService);

        bot.bruteForceStart();
        const result: ValidWord[] = bot.validWordList;
        const expected = 'wuShu';
        expect(result[27].word).toEqual(expected);
    });
});
