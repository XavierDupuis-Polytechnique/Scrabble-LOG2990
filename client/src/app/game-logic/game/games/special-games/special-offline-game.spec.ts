import { TestBed } from '@angular/core/testing';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { ObjectiveManagerService } from '@app/game-logic/game/objectives/objective-manager.service';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
const TIME_PER_TURN = 10;

describe('SpecialOfflineGame', () => {
    let game: SpecialOfflineGame;
    let timerSpy: TimerService;
    const randomBonus = false;
    let pointCalculatorSpy: jasmine.SpyObj<PointCalculatorService>;
    let boardSpy: jasmine.SpyObj<BoardService>;
    let messageSpy: jasmine.SpyObj<MessagesService>;
    let objectiveSpy: jasmine.SpyObj<ObjectiveManagerService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MessagesService, PointCalculatorService, BoardService, TimerService, PointCalculatorService],
        });
        timerSpy = TestBed.inject(TimerService);
        pointCalculatorSpy = jasmine.createSpyObj('PointCalculatorService', ['endOfGamePointDeduction']);
        boardSpy = jasmine.createSpyObj('BoardService', ['board']);
        messageSpy = jasmine.createSpyObj('MessagesService', ['receiveSystemMessage', 'onEndOfGame']);
        objectiveSpy = jasmine.createSpyObj('ObjectiveManagerService', ['chooseObjectives']);
        game = new SpecialOfflineGame(randomBonus, TIME_PER_TURN, timerSpy, pointCalculatorSpy, boardSpy, messageSpy, objectiveSpy);
    });

    it('should be created', () => {
        expect(game).toBeTruthy();
    });
});
