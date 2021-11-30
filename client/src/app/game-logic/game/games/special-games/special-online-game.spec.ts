/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { LightObjective, PrivateLightObjectives, SpecialGameState } from '@app/game-logic/game/games/online-game/game-state';
import { SpecialOnlineGame } from '@app/game-logic/game/games/special-games/special-online-game';
import { ObjectiveCreator } from '@app/game-logic/game/objectives/objective-creator/objective-creator.service';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { OnlineObjective } from '@app/game-logic/game/objectives/online-objective/online-objective';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';

describe('OnlineGame', () => {
    let game: SpecialOnlineGame;
    let boardService: BoardService;
    let gameSocketHandlerService: GameSocketHandlerService;
    let timer: TimerService;
    let player1: Player;
    let player2: Player;
    let gameState: SpecialGameState;
    let lightObjective: LightObjective;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;
    const dict = jasmine.createSpyObj('DictionaryService', ['getDictionary']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: dict }],
        });
        boardService = TestBed.inject(BoardService);
        gameSocketHandlerService = TestBed.inject(GameSocketHandlerService);
        timer = TestBed.inject(TimerService);
        objectiveNotifierSpy = jasmine.createSpyObj('ObjectiveNotifierService', ['sendObjectiveNotification']);

        game = new SpecialOnlineGame(
            '0',
            DEFAULT_TIME_PER_TURN,
            'p1',
            timer,
            gameSocketHandlerService,
            boardService,
            TestBed.inject(OnlineActionCompilerService),
            TestBed.inject(ObjectiveCreator),
        );
        player1 = new User('p1');
        player2 = new User('p2');
        game.players = [player1, player2];

        lightObjective = {
            name: 'objective1',
            description: 'objective1description',
            points: 123,
            owner: undefined,
            progressions: [
                { playerName: player1.name, progression: 0 },
                { playerName: player2.name, progression: 0 },
            ],
        };

        gameState = {
            players: [
                {
                    name: player1.name,
                    points: player1.points,
                    letterRack: player1.letterRack,
                },
                {
                    name: player2.name,
                    points: player2.points,
                    letterRack: player2.letterRack,
                },
            ],
            activePlayerIndex: 0,
            grid: boardService.board.grid,
            lettersRemaining: 88,
            isEndOfGame: false,
            winnerIndex: [],
            publicObjectives: [{ ...lightObjective }],
            privateObjectives: [
                { playerName: player1.name, privateObjectives: [{ ...lightObjective }] },
                { playerName: player2.name, privateObjectives: [{ ...lightObjective }] },
            ],
        };
    });

    it('should create an instance', () => {
        expect(game).toBeTruthy();
    });

    it('should have no objectives before receiving first gameState', () => {
        expect(game.hasObjectives).toBeFalsy();
    });

    it('should create objectives if there are none', () => {
        expect(game.publicObjectives.length).toBe(0);
        expect(game.privateObjectives.size).toBe(0);
        game.receiveState(gameState);
        expect(game.publicObjectives.length).toBe(gameState.publicObjectives.length);
        for (const [playerName, privateObjectives] of game.privateObjectives) {
            const gameStatePlayerObjectives = gameState.privateObjectives.find(
                (objectives) => objectives.playerName === playerName,
            )?.privateObjectives;
            expect(privateObjectives.length).toBe(gameStatePlayerObjectives?.length as number);
        }
    });

    it('should update objectives if they were already registered', () => {
        const onlineObjective = new OnlineObjective(objectiveNotifierSpy, lightObjective.name, lightObjective.description, lightObjective.points);
        const publicObjective = { ...onlineObjective };
        const privateObjective1 = { ...onlineObjective };
        const privateObjective2 = { ...onlineObjective };
        game.publicObjectives.push(publicObjective as OnlineObjective);
        game.privateObjectives.set(player1.name, [privateObjective1 as OnlineObjective]);
        game.privateObjectives.set(player2.name, [privateObjective2 as OnlineObjective]);

        gameState.publicObjectives[0].progressions[0].progression = 1;
        gameState.publicObjectives[0].owner = player1.name;

        game.receiveState(gameState);

        expect(game.publicObjectives[0].progressions.get(player1.name)).toBe(1);
        expect(game.publicObjectives[0].owner).toBe(player1.name);
    });

    it('should throw error if the game cannot find a corresponding public objective name', () => {
        expect(() => {
            game['updatePublicObjectives']([lightObjective]);
        }).toThrowError('Cannot find public objective with name objective1');
    });

    it('should throw error if the game cannot find a corresponding player for the private objectives', () => {
        const serverPrivateObjective: PrivateLightObjectives[] = [
            { playerName: 'p3', privateObjectives: [{ ...lightObjective }] },
            { playerName: 'p4', privateObjectives: [{ ...lightObjective }] },
        ];
        expect(() => {
            game['updatePrivateObjectives'](serverPrivateObjective);
        }).toThrowError('Cannot find private objectives for player p3');
    });

    it('should throw error if the game cannot find a corresponding player for the private objectives', () => {
        game.privateObjectives.set(player1.name, []);
        game.privateObjectives.set(player2.name, []);
        const serverPrivateObjective: PrivateLightObjectives[] = [
            { playerName: 'p1', privateObjectives: [{ ...lightObjective }] },
            { playerName: 'p2', privateObjectives: [{ ...lightObjective }] },
        ];
        expect(() => {
            game['updatePrivateObjectives'](serverPrivateObjective);
        }).toThrowError('Cannot find private objective with name objective1');
    });
});
