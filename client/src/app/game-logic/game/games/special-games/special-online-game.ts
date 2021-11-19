import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { LightObjective, SpecialGameState } from '@app/game-logic/game/games/online-game/game-state';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { SpecialGame } from '@app/game-logic/game/games/special-games/special-game';
import { ObjectiveCreator } from '@app/game-logic/game/objectives/objective-creator/objective-creator.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';

export class SpecialOnlineGame extends OnlineGame implements SpecialGame {
    privateObjectives = new Map<string, Objective[]>();
    publicObjectives = [] as Objective[];
    constructor(
        public gameToken: string,
        public timePerTurn: number,
        public userName: string,
        timer: TimerService,
        onlineSocket: GameSocketHandlerService,
        boardService: BoardService,
        onlineActionCompiler: OnlineActionCompilerService,
        private objectiveCreator: ObjectiveCreator,
    ) {
        super(gameToken, timePerTurn, userName, timer, onlineSocket, boardService, onlineActionCompiler);
    }

    protected updateClient(gameState: SpecialGameState) {
        super.updateClient(gameState);
        if (gameState.publicObjectives.length === 0) {
            this.publicObjectives = this.createPublicObjectives(gameState.publicObjectives);
            this.privateObjectives = this.createPrivateObjectives(gameState.privateObjectives);
        }
        this.updateObjectives(gameState.privateObjectives, gameState.publicObjectives);
    }

    private createPublicObjectives(publicObjectives: LightObjective[]): Objective[] {
        const createdObjectives: Objective[] = [];
        for (const objective of publicObjectives) {
            const name = objective.name;
            const points = objective.points;
            const description = objective.description;
            this.publicObjectives.push(this.objectiveCreator.createOnlineObjective(name, description, points));
        }
        return createdObjectives;
    }

    private createPrivateObjectives(privateObjectives: Map<string, LightObjective[]>): Map<string, Objective[]> {
        throw new Error('Method not implemented.');
    }

    private updateObjectives(privateObjectives: Map<string, LightObjective[]>, publicObjectives: LightObjective[]) {
        this.updatePrivateObjectives(privateObjectives);
        this.updatePublicObjectives(publicObjectives);
    }

    private updatePublicObjectives(publicObjectives: LightObjective[]) {
        for (const serverPublicObjective of publicObjectives) {
            const clientPublicObjective = this.publicObjectives.find((objective) => objective.name === serverPublicObjective.name);
            if (!clientPublicObjective) {
                throw new Error('Cannot find public objective with name ' + serverPublicObjective.name);
            }
            clientPublicObjective.owner = serverPublicObjective.owner;
            clientPublicObjective.progressions = serverPublicObjective.progressions;
        }
    }

    private updatePrivateObjectives(privateObjectives: Map<string, LightObjective[]>) {
        for (const [playerName, serverPrivateObjectives] of privateObjectives) {
            const clientPublicObjectives = this.privateObjectives.get(playerName);
            if (!clientPublicObjectives) {
                throw new Error('Cannot find private objectives for player ' + playerName);
            }
            for (const serverPrivateObjective of serverPrivateObjectives) {
                const clientPrivateObjective = clientPublicObjectives.find((objective) => objective.name === serverPrivateObjective.name);
                if (!clientPrivateObjective) {
                    throw new Error('Cannot find private objective with name ' + serverPrivateObjective.name);
                }
                clientPrivateObjective.owner = serverPrivateObjective.owner;
                clientPrivateObjective.progressions = serverPrivateObjective.progressions;
            }
        }
    }
}
