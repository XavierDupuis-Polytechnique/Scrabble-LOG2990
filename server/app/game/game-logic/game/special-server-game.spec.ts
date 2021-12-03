/* eslint-disable dot-notation */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-magic-numbers */

import { PRIVATE_OBJECTIVE_COUNT, PUBLIC_OBJECTIVE_COUNT } from '@app/constants';
import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { Action } from '@app/game/game-logic/actions/action';
import { SpecialServerGame } from '@app/game/game-logic/game/special-server-game';
import { EndOfGame } from '@app/game/game-logic/interface/end-of-game.interface';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { ObjectiveCreator } from '@app/game/game-logic/objectives/objective-creator/objective-creator.service';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';
import { Subject } from 'rxjs';

const TIME_PER_TURN = 10;

class MockObjective extends Objective {
    name = 'mockObjective';
    points = 123;
    completed = false;
    get isCompleted(): boolean {
        return this.completed;
    }
    update(): void {
        this.completed = true;
    }
    protected updateProgression(): void {
        return;
    }
}
class MockAction extends Action {
    protected perform(): void {
        return;
    }
}
class MockPlayer extends Player {
    setActive(): void {
        return;
    }
}

describe('SpecialServerGame', () => {
    let game: SpecialServerGame;
    const randomBonus = false;
    const pointCalculatorStub = createSinonStubInstance<PointCalculatorService>(PointCalculatorService);
    const gameCompilerStub = createSinonStubInstance<GameCompiler>(GameCompiler);
    const systemMessagesServiceStub = createSinonStubInstance<SystemMessagesService>(SystemMessagesService);
    const timerControllerStub = createSinonStubInstance<TimerController>(TimerController);
    const objectiveNotifierStub = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);
    const objectiveCreatorStub = createSinonStubInstance<ObjectiveCreator>(ObjectiveCreator);
    objectiveCreatorStub.chooseObjectives.callsFake((localGameToken: string) => {
        const publicObjectives = [];
        for (let i = 0; i < PUBLIC_OBJECTIVE_COUNT; i++) {
            publicObjectives.push(new MockObjective(localGameToken, objectiveNotifierStub));
        }

        const private1 = [];
        for (let j = 0; j < PRIVATE_OBJECTIVE_COUNT; j++) {
            private1.push(new MockObjective(localGameToken, objectiveNotifierStub));
        }

        const private2 = [];
        for (let j = 0; j < PRIVATE_OBJECTIVE_COUNT; j++) {
            private2.push(new MockObjective(localGameToken, objectiveNotifierStub));
        }
        return { privateObjectives: [private1, private2], publicObjectives };
    });
    const newGameStateSubject = new Subject<GameStateToken>();
    const endGameSubject = new Subject<EndOfGame>();
    const gameToken = 'gameToken';
    const p1 = new MockPlayer('p1');
    const p2 = new MockPlayer('p2');

    beforeEach(() => {
        game = new SpecialServerGame(
            timerControllerStub,
            randomBonus,
            TIME_PER_TURN,
            gameToken,
            pointCalculatorStub,
            gameCompilerStub,
            systemMessagesServiceStub,
            newGameStateSubject,
            endGameSubject,
            objectiveCreatorStub,
        );
        game.players = [p1, p2];
    });

    it('should be created', () => {
        expect(game).to.be.instanceof(SpecialServerGame);
    });

    it('should start a game through super.start', () => {
        game.start();
        expect(game.activePlayerIndex).to.not.be.an('undefined');
        expect(game.publicObjectives).to.not.be.an('undefined');
        expect(game.privateObjectives).to.not.be.an('undefined');
    });

    it('should allocate private and public objectives', () => {
        game['allocateObjectives']();
        expect(game.publicObjectives.length).to.be.equal(PUBLIC_OBJECTIVE_COUNT);
        for (const player of game.players) {
            expect(game.privateObjectives.get(player.name)?.length).to.be.equal(PRIVATE_OBJECTIVE_COUNT);
        }
    });

    it('should properly update private and public objectives', () => {
        game['allocateObjectives']();
        const action = new MockAction(p1);
        const params: ObjectiveUpdateParams = {
            previousGrid: [],
            currentGrid: [],
            lettersToPlace: [],
            formedWords: [],
            affectedCoords: [],
        };
        game.updateObjectives(action, params);

        for (const publicObjective of game.publicObjectives) {
            expect(publicObjective.isCompleted).to.be.equal(true);
        }
        const p1Objective = (game.privateObjectives.get(p1.name) as Objective[])[0];
        expect(p1Objective.isCompleted).to.be.equal(true);
        const p2Objective = (game.privateObjectives.get(p2.name) as Objective[])[0];
        expect(p2Objective.isCompleted).to.be.equal(false);
    });
});
