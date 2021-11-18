import { Action } from '@app/game-logic/actions/action';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { OfflineGame } from '@app/game-logic/game/games/solo-game/offline-game';
import { SpecialGame } from '@app/game-logic/game/games/special-games/special-game';
import { ObjectiveCreator } from '@app/game-logic/game/objectives/objective-creator/objective-creator.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
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
        private objectiveCreator: ObjectiveCreator,
    ) {
        super(randomBonus, timePerTurn, timer, pointCalculator, boardService, messagesService);
    }

    allocateObjectives() {
        this.allocatePrivateObjectives();
        this.allocatePublicObjectives();
    }

    updateObjectives(action: Action, params: ObjectiveUpdateParams) {
        for (const publicObjective of this.publicObjectives) {
            publicObjective.update(action, params);
        }

        const playerObjectives = this.privateObjectives.get(action.player.name);
        if (!playerObjectives) {
            return;
        }

        for (const privateObjective of playerObjectives) {
            privateObjective.update(action, params);
        }
    }

    private allocatePrivateObjectives() {
        this.privateObjectives = new Map<string, Objective[]>();
        for (const player of this.players) {
            const playerPrivateObjectives = this.objectiveCreator.chooseObjectives(ObjectiveCreator.privateObjectiveCount);
            this.privateObjectives.set(player.name, playerPrivateObjectives);
        }
    }

    private allocatePublicObjectives() {
        this.publicObjectives = [];
        const publicObjectives = this.objectiveCreator.chooseObjectives(ObjectiveCreator.publicObjectiveCount);
        this.publicObjectives = publicObjectives;
    }
}
