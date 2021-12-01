/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { PRIVATE_OBJECTIVE_COUNT, PUBLIC_OBJECTIVE_COUNT } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { ObjectiveCreator } from '@app/game-logic/game/objectives/objective-creator/objective-creator.service';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { Player } from '@app/game-logic/player/player';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
const TIME_PER_TURN = 10;

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

describe('SpecialOfflineGame', () => {
    let game: SpecialOfflineGame;
    let timerSpy: TimerService;
    const randomBonus = false;
    let pointCalculatorSpy: jasmine.SpyObj<PointCalculatorService>;
    let boardSpy: jasmine.SpyObj<BoardService>;
    let messageSpy: jasmine.SpyObj<MessagesService>;
    let objectiveCreator: ObjectiveCreator;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;
    const p1 = new MockPlayer('p1');
    const p2 = new MockPlayer('p2');

    beforeEach(() => {
        TestBed.configureTestingModule({});
        timerSpy = TestBed.inject(TimerService);
        pointCalculatorSpy = jasmine.createSpyObj('PointCalculatorService', ['endOfGamePointDeduction']);
        boardSpy = jasmine.createSpyObj('BoardService', ['board']);
        messageSpy = jasmine.createSpyObj('MessagesService', ['receiveSystemMessage', 'onEndOfGame']);
        objectiveNotifierSpy = jasmine.createSpyObj('ObjectiveNotifierService', ['sendObjectiveNotification']);
        objectiveCreator = TestBed.inject(ObjectiveCreator);
        spyOn(objectiveCreator, 'chooseObjectives').and.callFake(() => {
            const publicObjectives = [];
            for (let i = 0; i < PUBLIC_OBJECTIVE_COUNT; i++) {
                publicObjectives.push(new MockObjective(objectiveNotifierSpy));
            }

            const private1 = [];
            for (let j = 0; j < PRIVATE_OBJECTIVE_COUNT; j++) {
                private1.push(new MockObjective(objectiveNotifierSpy));
            }

            const private2 = [];
            for (let j = 0; j < PRIVATE_OBJECTIVE_COUNT; j++) {
                private2.push(new MockObjective(objectiveNotifierSpy));
            }
            return { privateObjectives: [private1, private2], publicObjectives };
        });
        game = new SpecialOfflineGame(randomBonus, TIME_PER_TURN, timerSpy, pointCalculatorSpy, boardSpy, messageSpy, objectiveCreator);
        game.players = [p1, p2];
    });

    it('should be created', () => {
        expect(game).toBeTruthy();
    });

    it('should allocate private and public objectives', () => {
        game.allocateObjectives();
        expect(game.publicObjectives.length).toBe(PUBLIC_OBJECTIVE_COUNT);
        for (const player of game.players) {
            expect(game.privateObjectives.get(player.name)?.length).toBe(PRIVATE_OBJECTIVE_COUNT);
        }
    });

    it('should properly update private and public objectives', () => {
        game.allocateObjectives();
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
            expect(publicObjective.isCompleted).toBeTruthy();
        }
        const p1Objective = (game.privateObjectives.get(p1.name) as Objective[])[0];
        expect(p1Objective.isCompleted).toBeTruthy();
        const p2Objective = (game.privateObjectives.get(p2.name) as Objective[])[0];
        expect(p2Objective.isCompleted).toBeFalsy();
    });

    it('should not update private objective when no private objective', () => {
        const mockPublicObjectives = {
            update: () => {
                return;
            },
        } as unknown as Objective;
        game.publicObjectives = [mockPublicObjectives, mockPublicObjectives];
        game.privateObjectives = new Map<string, Objective[]>();
        const mockAction = {
            player: {
                name: 'test',
            },
        } as unknown as Action;
        expect(() => {
            game.updateObjectives(mockAction, {} as unknown as ObjectiveUpdateParams);
        }).not.toThrow();
    });
});
