import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { Action } from './action';

class TestAction extends Action {
    protected perform(game: Game) {
        return game;
    }
}
const TIME_PER_TURN = 1000;

describe('Action', () => {
    let game: Game;
    let action: TestAction;
    let user: User;
    let gameSpy: jasmine.Spy<(action: Action) => void>;
    const randomBonus = false;
    beforeEach(() => {
        const boardService = new BoardService();
        game = new Game(
            randomBonus,
            TIME_PER_TURN,
            new TimerService(),
            new PointCalculatorService(boardService),
            boardService,
            new MessagesService(new CommandParserService()),
        );
        gameSpy = spyOn(game, 'doAction');
        user = new User('Paul');
        action = new TestAction(user);
    });

    it('should create instance', () => {
        expect(new TestAction(user)).toBeTruthy();
    });

    it('should call #doAction from game when executed', () => {
        action.execute(game);
        expect(gameSpy).toHaveBeenCalled();
    });
});
