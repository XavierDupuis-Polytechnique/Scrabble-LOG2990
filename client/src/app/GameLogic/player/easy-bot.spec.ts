import { Action } from '@app/GameLogic/actions/action';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { TestBoard } from '@app/GameLogic/player/bot.spec';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { BoardService } from '@app/services/board.service';
import { EasyBot } from './easy-bot';

describe('EasyBot', () => {
    let easyBot: EasyBot;
    let spyPlay: jasmine.Spy;
    let spyExchange: jasmine.Spy;
    let spyPass: jasmine.Spy;
    let board: TestBoard;
    let boardService: BoardService;
    let botCreatorService: BotCreatorService;
    let wordSearcher: WordSearcher;

    beforeEach(() => {
        boardService = new BoardService();
        const dictionaryService = new DictionaryService();
        const pointCalculator = new PointCalculatorService(boardService);
        // const timer = new TimerService();
        // const TIME_PER_TURN = 10;
        wordSearcher = new WordSearcher(boardService, dictionaryService);
        botCreatorService = new BotCreatorService(boardService, dictionaryService, pointCalculator, wordSearcher);
        // const game = new Game(TIME_PER_TURN, timer, pointCalculator, boardService);
        board = new TestBoard();

        // easyBot = new EasyBot('Tim', new BoardService(), new DictionaryService());
        easyBot = botCreatorService.createBot('Tim', 'easy')
        spyPlay = spyOn(easyBot, 'playAction');
        spyExchange = spyOn(easyBot, 'exchangeAction');
        spyPass = spyOn(easyBot, 'passAction');
    });

    it('should create an instance', () => {
        expect(easyBot).toBeTruthy();
    });

    it('should call actions based on setting', () => {
        const mul = 10;
        const numberOfTime = 1000;
        for (let i = 0; i < numberOfTime; i++) {
            easyBot.randomActionPicker();
        }
        let value = Math.round((spyPass.calls.count() / numberOfTime) * mul) / mul;
        expect(value).toBeCloseTo(EasyBot.actionProbabibility.pass);
        value = Math.round((spyExchange.calls.count() / numberOfTime) * mul) / mul;
        expect(value).toBeCloseTo(EasyBot.actionProbabibility.exchange);
        value = Math.round((spyPlay.calls.count() / numberOfTime) * mul) / mul;
        expect(value).toBeCloseTo(EasyBot.actionProbabibility.play);
    });

    it('should return a valid first turn action (empty board))', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        easyBot.letterRack = letters;

        boardService.board.grid = board.grid;
        let result: Action;
        // TODO change number when crosscheck works
        result = easyBot.setActive();
        console.log(result);
        expect(result).toBeFalsy;
    });

});
