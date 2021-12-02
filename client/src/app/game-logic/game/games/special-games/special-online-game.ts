import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { LightObjective, PrivateLightObjectives, SpecialGameState } from '@app/game-logic/game/games/online-game/game-state';
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

    get hasObjectives(): boolean {
        return this.publicObjectives.length > 0 && this.privateObjectives.size > 0;
    }

    receiveState(gameState: SpecialGameState) {
        super.receiveState(gameState);
        if (!this.hasObjectives) {
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
            createdObjectives.push(this.objectiveCreator.createOnlineObjective(name, description, points));
        }
        return createdObjectives;
    }

    private createPrivateObjectives(privateObjectives: PrivateLightObjectives[]): Map<string, Objective[]> {
        const createdObjectives: Map<string, Objective[]> = new Map<string, Objective[]>();
        for (const serverPrivateObjectives of privateObjectives) {
            const createdObjectivesForPlayer: Objective[] = [];
            for (const objective of serverPrivateObjectives.privateObjectives) {
                const name = objective.name;
                const points = objective.points;
                const description = objective.description;
                createdObjectivesForPlayer.push(this.objectiveCreator.createOnlineObjective(name, description, points));
            }
            createdObjectives.set(serverPrivateObjectives.playerName, createdObjectivesForPlayer);
        }
        return createdObjectives;
    }

    private updateObjectives(privateObjectives: PrivateLightObjectives[], publicObjectives: LightObjective[]) {
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
            for (const playerProgression of serverPublicObjective.progressions) {
                const playerName = playerProgression.playerName;
                const progression = playerProgression.progression;
                clientPublicObjective.progressions.set(playerName, progression);
            }
        }
    }

    private updatePrivateObjectives(privateObjectives: PrivateLightObjectives[]) {
        for (const serverPrivateObjectives of privateObjectives) {
            const clientPublicObjectives = this.privateObjectives.get(serverPrivateObjectives.playerName);
            if (!clientPublicObjectives) {
                throw new Error('Cannot find private objectives for player ' + serverPrivateObjectives.playerName);
            }
            for (const serverPrivateObjective of serverPrivateObjectives.privateObjectives) {
                const clientPrivateObjective = clientPublicObjectives.find((objective) => objective.name === serverPrivateObjective.name);
                if (!clientPrivateObjective) {
                    throw new Error('Cannot find private objective with name ' + serverPrivateObjective.name);
                }
                clientPrivateObjective.owner = serverPrivateObjective.owner;
                for (const playerProgression of serverPrivateObjective.progressions) {
                    const playerName = playerProgression.playerName;
                    const progression = playerProgression.progression;
                    clientPrivateObjective.progressions.set(playerName, progression);
                }
            }
        }
    }
}
