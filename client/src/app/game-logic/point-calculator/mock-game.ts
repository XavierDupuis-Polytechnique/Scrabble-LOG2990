import { MAX_CONSECUTIVE_PASS } from '@app/game-logic/constants';
import { Board } from '@app/game-logic/game/board/board';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';

export class MockGame extends OfflineGame {
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
