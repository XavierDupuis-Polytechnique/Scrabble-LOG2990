import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { EasyBot } from './easy-bot';

describe('EasyBot', () => {
    let easyBot: EasyBot;
    let spyPlay: jasmine.Spy;
    let spyExchange: jasmine.Spy;
    let spyPass: jasmine.Spy;
    beforeEach(() => {
        const boardService = new BoardService();
        const dictionaryService = new DictionaryService();
        const pointCalculator = new PointCalculatorService();
        const timer = new TimerService();
        const TIME_PER_TURN = 10;
        const game = new Game(TIME_PER_TURN, timer, pointCalculator, boardService);

        // easyBot = new EasyBot('Tim', new BoardService(), new DictionaryService());
        easyBot = new EasyBot('Tim', boardService, dictionaryService, game);
        spyPlay = spyOn(easyBot, 'play');
        spyExchange = spyOn(easyBot, 'exchange');
        spyPass = spyOn(easyBot, 'pass');
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
});
