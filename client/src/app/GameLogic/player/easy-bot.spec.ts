import { TestBed } from '@angular/core/testing';
import { Action } from '@app/GameLogic/actions/action';
import { DEFAULT_TIME_PER_TURN } from '@app/GameLogic/constants';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { BotMessagesService } from '@app/GameLogic/player/bot-messages.service';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';
import { EasyBot } from './easy-bot';

describe('EasyBot', () => {
    let easyBot: EasyBot;
    let spyPlay: jasmine.Spy;
    let spyExchange: jasmine.Spy;
    let boardService: BoardService;
    let botCreatorService: BotCreatorService;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let messagesService: MessagesService;
    let gameInfo: GameInfoService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BoardService, BotCreatorService, BotMessagesService, TimerService, PointCalculatorService, MessagesService, GameInfoService],
        });
        boardService = TestBed.inject(BoardService);
        botCreatorService = TestBed.inject(BotCreatorService);
        timer = TestBed.inject(TimerService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        messagesService = TestBed.inject(MessagesService);
        gameInfo = TestBed.inject(GameInfoService);

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
            gameInfo.receiveGame(new Game(DEFAULT_TIME_PER_TURN, timer, pointCalculator, boardService, messagesService));
            easyBot.randomActionPicker();
        }
        let value;
        value = Math.round((spyExchange.calls.count() / numberOfTime) * mul) / mul;
        expect(value).toBeCloseTo(EasyBot.actionProbability.exchange);
        value = Math.round((spyPlay.calls.count() / numberOfTime) * mul) / mul;
        expect(value).toBeCloseTo(EasyBot.actionProbability.play);
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

        spyExchange.and.callThrough();
        spyPlay.and.callThrough();
        const result: Action = easyBot.setActive();
        expect(result).toBeTruthy();
    });
});
