import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { HardBot } from '@app/GameLogic/player/hard-bot';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';

describe('HardBot', () => {
    let bot: HardBot;
    beforeEach(() => {
        const boardService = new BoardService();
        const dictionaryService = new DictionaryService();
        const pointCalculator = new PointCalculatorService();
        const timer = new TimerService();
        const TIME_PER_TURN = 10;
        const game = new Game(TIME_PER_TURN, timer, pointCalculator, boardService);
        bot = new HardBot('Tim', boardService, dictionaryService, game);
    });

    it('should create an instance', () => {
        expect(bot).toBeTruthy();
    });
});
