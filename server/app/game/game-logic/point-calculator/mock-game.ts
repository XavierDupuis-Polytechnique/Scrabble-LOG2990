// import { Board } from '@app/game/game-logic/board/board';
// import { MAX_CONSECUTIVE_PASS } from '@app/game/game-logic/constants';
// import { ServerGame } from '@app/game/game-logic/game/server-game';
// import { Player } from '@app/game/game-logic/player/player';
// import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
// import { Timer } from '@app/game/game-logic/timer/timer.service';

// export class MockGame extends ServerGame {
//     static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
//     otherPlayer: Player = new Player('otherPlayer');
//     activePlayer: Player = new Player('ActivePlayer');
//     players: Player[];
//     consecutivePass: number = MAX_CONSECUTIVE_PASS;
//     board: Board;

//     constructor(
//         randomBonus: boolean,
//         time: number,
//         timerService: Timer,
//         pointCalculatorService: PointCalculatorService,
//         // messageService: MessagesService,
//     ) {
//         super(randomBonus, time, timerService, pointCalculatorService, boardService /* ,messageService*/);
//         this.players = [this.activePlayer, this.otherPlayer];
//         this.board = boardService.board;
//     }
//     getActivePlayer() {
//         return this.activePlayer;
//     }
// }
