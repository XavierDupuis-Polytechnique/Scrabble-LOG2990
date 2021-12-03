import { TestBed } from '@angular/core/testing';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { Action } from './action';

class TestAction extends Action {
    protected perform(game: OfflineGame) {
        return game;
    }
}
const TIME_PER_TURN = 1000;

describe('Action', () => {
    let game: OfflineGame;
    let action: TestAction;
    let user: User;
    let gameSpy: jasmine.Spy<(action: Action) => void>;
    const randomBonus = false;
    beforeEach(() => {
        const dict = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
        TestBed.configureTestingModule({ providers: [{ provide: DictionaryService, useValue: dict }] });
        const messageService = TestBed.inject(MessagesService);
        const timerService = TestBed.inject(TimerService);
        const pointCalulatorService = TestBed.inject(PointCalculatorService);
        const boardService = TestBed.inject(BoardService);
        game = new OfflineGame(randomBonus, TIME_PER_TURN, timerService, pointCalulatorService, boardService, messageService);
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
