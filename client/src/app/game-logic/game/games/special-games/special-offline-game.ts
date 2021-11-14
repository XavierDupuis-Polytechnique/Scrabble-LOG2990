import { BoardService } from '@app/game-logic/game/board/board.service';
import { OfflineGame } from '@app/game-logic/game/games/solo-game/offline-game';
import { SpecialGame } from '@app/game-logic/game/games/special-games/special-game';
import { ObjectiveManagerService } from '@app/game-logic/game/objectives/objective-manager.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';

export class SpecialOfflineGame extends OfflineGame implements SpecialGame {
    privateObjectives: Map<string, Objective[]>;
    publicObjectives: Objective[];
    constructor(
        public randomBonus: boolean,
        public timePerTurn: number,
        timer: TimerService,
        pointCalculator: PointCalculatorService,
        boardService: BoardService,
        messagesService: MessagesService,
        private objectiveManager: ObjectiveManagerService,
    ) {
        super(randomBonus, timePerTurn, timer, pointCalculator, boardService, messagesService);
        this.privateObjectives = new Map<string, Objective[]>();
        this.publicObjectives = [];
    }

    allocateObjectives() {
        this.allocatePrivateObjectives();
        this.allocatePublicObjectives();
    }

    private allocatePrivateObjectives() {
        for (const player of this.players) {
            const playerPrivateObjectives = this.objectiveManager.chooseObjectives(ObjectiveManagerService.privateObjectiveCount);
            this.privateObjectives.set(player.name, playerPrivateObjectives);
        }
    }

    private allocatePublicObjectives() {
        const publicObjectives = this.objectiveManager.chooseObjectives(ObjectiveManagerService.publicObjectiveCount);
        this.publicObjectives = publicObjectives;
    }
}
