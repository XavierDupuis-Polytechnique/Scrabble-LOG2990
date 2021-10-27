import { Board } from '@app/game/game-logic/board/board';
import { BoardService } from '@app/game/game-logic/board/board.service';
import { MAX_CONSECUTIVE_PASS } from '@app/game/game-logic/constants';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { Player } from '@app/game/game-logic/player/player';
import { User } from '@app/game/game-logic/player/user';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerService } from '@app/game/game-logic/timer/timer.service';

export class MockGame extends ServerGame {
    static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
    otherPlayer: Player = new User('otherPlayer');
    activePlayer: Player = new User('ActivePlayer');
    players: Player[];
    consecutivePass: number = MAX_CONSECUTIVE_PASS;
    board: Board;

    constructor(
        randomBonus: boolean,
        time: number,
        timerService: TimerService,
        pointCalculatorService: PointCalculatorService,
        boardService: BoardService,
        // messageService: MessagesService,
    ) {
        super(randomBonus, time, timerService, pointCalculatorService, boardService /* ,messageService*/);
        this.players = [this.activePlayer, this.otherPlayer];
        this.board = boardService.board;
    }
    getActivePlayer() {
        return this.activePlayer;
    }
}
