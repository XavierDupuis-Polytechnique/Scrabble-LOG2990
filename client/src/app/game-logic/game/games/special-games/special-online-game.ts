import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { SpecialGame } from '@app/game-logic/game/games/special-games/special-game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';

export class SpecialOnlineGame extends OnlineGame implements SpecialGame {
    privateObjectives: Map<string, Objective[]>;
    publicObjectives: Objective[];
    constructor(
        public gameToken: string,
        public timePerTurn: number,
        public userName: string,
        timer: TimerService,
        onlineSocket: GameSocketHandlerService,
        boardService: BoardService,
        onlineActionCompiler: OnlineActionCompilerService,
    ) {
        super(gameToken, timePerTurn, userName, timer, onlineSocket, boardService, onlineActionCompiler);
        this.privateObjectives = new Map<string, Objective[]>();
        this.publicObjectives = [];
    }

    updateObjectives(privateObjectives: Map<string, Objective[]>, publicObjectives: Objective[]) {
        this.privateObjectives = privateObjectives;
        this.publicObjectives = publicObjectives;
    }
}
