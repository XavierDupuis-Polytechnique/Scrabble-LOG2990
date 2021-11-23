import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { Board } from '@app/game/game-logic/board/board';
import { MAX_CONSECUTIVE_PASS } from '@app/game/game-logic/constants';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { EndOfGame } from '@app/game/game-logic/interface/end-of-game.interface';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { Subject } from 'rxjs';

export class MockGame extends ServerGame {
    static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
    otherPlayer: Player = new Player('otherPlayer');
    activePlayer: Player = new Player('ActivePlayer');
    players: Player[];
    consecutivePass: number = MAX_CONSECUTIVE_PASS;
    board: Board;

    constructor(
        timerController: TimerController,
        randomBonus: boolean,
        timePerTurn: number,
        gameToken: string,
        pointCalculatorService: PointCalculatorService,
        gameCompiler: GameCompiler,
        messagesService: SystemMessagesService,
        newGameStateSubject: Subject<GameStateToken>,
        endGameSubject: Subject<EndOfGame>,
    ) {
        super(
            timerController,
            randomBonus,
            timePerTurn,
            gameToken,
            pointCalculatorService,
            gameCompiler,
            messagesService,
            newGameStateSubject,
            endGameSubject,
        );
        this.players = [this.activePlayer, this.otherPlayer];
        this.board = new Board();
    }
    getActivePlayer() {
        return this.activePlayer;
    }
}
