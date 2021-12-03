import { Action } from '@app/game-logic/actions/action';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
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
        loadGame: boolean = false,
    ) {
        super(randomBonus, timePerTurn, timer, pointCalculator, boardService, messagesService, loadGame);
    }

    allocateObjectives() {
        const generatedObjectives = this.objectiveCreator.chooseObjectives();
        this.publicObjectives = generatedObjectives.publicObjectives;
        for (const objective of this.publicObjectives) {
            this.players.forEach((player) => {
                objective.progressions.set(player.name, 0);
            });
        }
        this.privateObjectives = new Map<string, Objective[]>();
        for (let index = 0; index < this.players.length; index++) {
            const playerName = this.players[index].name;
            const privateObjectives = generatedObjectives.privateObjectives[index];
            this.privateObjectives.set(playerName, privateObjectives);
            for (const objective of privateObjectives) {
                objective.progressions.set(playerName, 0);
            }
        }
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
}
