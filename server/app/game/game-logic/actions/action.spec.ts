// import { CommandParserService } from '@app/game-logic/commands/command-parser/command-parser.service';
// import { BoardService } from '@app/game-logic/game/board/board.service';
// import { Game } from '@app/game-logic/game/games/game';
// import { TimerService } from '@app/game-logic/game/timer/timer.service';
// import { MessagesService } from '@app/game-logic/messages/messages.service';
// import { User } from '@app/game-logic/player/user';
// import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
// import { Action } from './action';

// class TestAction extends Action {
//     protected perform(game: Game) {
//         return game;
//     }
// }
// const TIME_PER_TURN = 1000;

// describe('Action', () => {
//     let game: Game;
//     let action: TestAction;
//     let user: User;
//     let gameSpy: jasmine.Spy<(action: Action) => void>;
//     const randomBonus = false;
//     beforeEach(() => {
//         const boardService = new BoardService();
//         game = new Game(
//             randomBonus,
//             TIME_PER_TURN,
//             new TimerService(),
//             new PointCalculatorService(boardService),
//             boardService,
//             new MessagesService(new CommandParserService()),
//         );
//         gameSpy = spyOn(game, 'doAction');
//         user = new User('Paul');
//         action = new TestAction(user);
//     });

//     it('should create instance', () => {
//         expect(new TestAction(user)).to.be.equal(true);
//     });

//     it('should call #doAction from game when executed', () => {
//         action.execute(game);
//         expect(gameSpy).toHaveBeenCalled();
//     });
// });
