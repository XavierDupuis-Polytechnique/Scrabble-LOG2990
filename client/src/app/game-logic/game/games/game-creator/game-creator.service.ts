import { Injectable } from '@angular/core';
import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { OfflineGameCreationParams, OnlineGameCreationParams } from '@app/game-logic/game/games/game-creator/game-creation-params';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { SpecialOnlineGame } from '@app/game-logic/game/games/special-games/special-online-game';
import { ObjectiveCreator } from '@app/game-logic/game/objectives/objective-creator/objective-creator.service';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';

@Injectable({
    providedIn: 'root',
})
export class GameCreatorService {
    constructor(
        private timer: TimerService,
        private pointCalculator: PointCalculatorService,
        private boardService: BoardService,
        private messageService: MessagesService,
        private gameSocketHandler: GameSocketHandlerService,
        private onlineActionCompiler: OnlineActionCompilerService,
        private objectiveCreator: ObjectiveCreator,
    ) {}

    createSpecialOnlineGame(gameCreationParams: OnlineGameCreationParams): SpecialOnlineGame {
        return new SpecialOnlineGame(
            gameCreationParams.id,
            gameCreationParams.timePerTurn,
            gameCreationParams.username,
            this.timer,
            this.gameSocketHandler,
            this.boardService,
            this.onlineActionCompiler,
            this.objectiveCreator,
        );
    }
    createOnlineGame(gameCreationParams: OnlineGameCreationParams): OnlineGame {
        return new OnlineGame(
            gameCreationParams.id,
            gameCreationParams.timePerTurn,
            gameCreationParams.username,
            this.timer,
            this.gameSocketHandler,
            this.boardService,
            this.onlineActionCompiler,
        );
    }
    createSpecialOfflineGame(gameCreationParams: OfflineGameCreationParams, isLoaded: boolean = false): SpecialOfflineGame {
        return new SpecialOfflineGame(
            gameCreationParams.randomBonus,
            gameCreationParams.timePerTurn,
            this.timer,
            this.pointCalculator,
            this.boardService,
            this.messageService,
            this.objectiveCreator,
            isLoaded,
        );
    }
    createOfflineGame(gameCreationParams: OfflineGameCreationParams, isLoaded: boolean = false): OfflineGame {
        return new OfflineGame(
            gameCreationParams.randomBonus,
            gameCreationParams.timePerTurn,
            this.timer,
            this.pointCalculator,
            this.boardService,
            this.messageService,
            isLoaded,
        );
    }
}
