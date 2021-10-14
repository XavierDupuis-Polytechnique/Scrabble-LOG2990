import { MAX_CONSECUTIVE_PASS } from '@app/GameLogic/constants';
import { Board } from '@app/GameLogic/game/board/board';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';

export class MockGame extends Game {
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
        messageService: MessagesService,
    ) {
        super(randomBonus, time, timerService, pointCalculatorService, boardService, messageService);
        this.players = [this.activePlayer, this.otherPlayer];
        this.board = boardService.board;
    }
    getActivePlayer() {
        return this.activePlayer;
    }
}
