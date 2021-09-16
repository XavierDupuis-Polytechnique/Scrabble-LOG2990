import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';
import { TimerService } from '../timer/timer.service';
import { Log2990Game } from './log2990-game';

describe('Log2990Game', () => {
    it('should create an instance', () => {
        expect(new Log2990Game(6000, new TimerService(), new PointCalculatorService(), new BoardService())).toBeTruthy();
    });
});
