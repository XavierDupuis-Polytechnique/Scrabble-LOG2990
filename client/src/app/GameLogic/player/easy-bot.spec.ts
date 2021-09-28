import { TestBed } from '@angular/core/testing';
import { Action } from '@app/GameLogic/actions/action';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { BotMessagesService } from '@app/GameLogic/player/bot-messages.service';
import { TestBoard } from '@app/GameLogic/player/bot.spec';
import { BoardService } from '@app/services/board.service';
import { EasyBot } from './easy-bot';

describe('EasyBot', () => {
    let easyBot: EasyBot;
    let spyPlay: jasmine.Spy;
    let spyExchange: jasmine.Spy;
    let board: TestBoard;
    let boardService: BoardService;
    let botCreatorService: BotCreatorService;
    // let wordSearcher: WordSearcher;
    // let botMessagesService: BotMessagesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BoardService, BotCreatorService, BotMessagesService],
        });
        boardService = TestBed.inject(BoardService);
        // botMessagesService = TestBed.inject(BotMessagesService);
        botCreatorService = TestBed.inject(BotCreatorService);
        // const dictionaryService = new DictionaryService();
        // boardService = new BoardService();
        // const pointCalculator = new PointCalculatorService(boardService);
        // // const timer = new TimerService();
        // // const TIME_PER_TURN = 10;
        // wordSearcher = new WordSearcher(boardService, dictionaryService);
        // // const game = new Game(TIME_PER_TURN, timer, pointCalculator, boardService);
        board = new TestBoard();

        // easyBot = new EasyBot('Tim', new BoardService(), new DictionaryService());
        easyBot = botCreatorService.createBot('Tim', 'easy') as EasyBot;
        spyPlay = spyOn(easyBot, 'playAction');
        spyExchange = spyOn(easyBot, 'exchangeAction');
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
        let value;
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
        const result: Action = easyBot.setActive();
        // TODO change number when crosscheck works
        // console.log(result);
        expect(result).toBeTruthy();
    });
});
