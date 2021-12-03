/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { BOARD_DIMENSION, DEFAULT_DICTIONARY_TITLE, DEFAULT_TIME_PER_TURN, MIDDLE_OF_BOARD } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { Tile } from '@app/game-logic/game/board/tile';
import { Game } from '@app/game-logic/game/games/game';
import { GameSettings } from '@app/game-logic/game/games/game-settings.interface';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { ForfeitedGameState, LightPlayer } from '@app/game-logic/game/games/online-game/game-state';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { SpecialOnlineGame } from '@app/game-logic/game/games/special-games/special-online-game';
import { ObjectiveCreator } from '@app/game-logic/game/objectives/objective-creator/objective-creator.service';
import { TransitionObjective } from '@app/game-logic/game/objectives/objectives/transition-objectives';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { EasyBot } from '@app/game-logic/player/bot/easy-bot';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
import { BotHttpService } from '@app/services/bot-http.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';
import { OnlineGameSettings } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { UserAuth } from '@app/socket-handler/interfaces/user-auth.interface';
import { of } from 'rxjs';
import { GameManagerService } from './game-manager.service';

describe('GameManagerService', () => {
    let service: GameManagerService;

    const botHttpService = jasmine.createSpyObj('BotHttpService', ['getDataInfo']);

    const obs = of(['Test1', 'Test2', 'Test3']);
    botHttpService.getDataInfo.and.returnValue(obs);
    let commandExecuterMock: CommandExecuterService;
    let leaderboardServiceMock: LeaderboardService;
    const dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['getDictionary']);
    const dict = new DictionaryService(dictHttpServiceMock);

    beforeEach(() => {
        commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute', 'resetDebug']);
        leaderboardServiceMock = jasmine.createSpyObj('LeaderboardService', ['updateLeaderboard']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: CommandExecuterService, useValue: commandExecuterMock },
                { provide: LeaderboardService, useValue: leaderboardServiceMock },
                { provide: BotHttpService, useValue: botHttpService },
            ],
        });
        service = TestBed.inject(GameManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw error if game is not created first', () => {
        expect(() => {
            service.startGame();
        }).toThrow(Error('No game created yet'));
    });

    it('should emit void on start game', () => {
        service.newGame$.subscribe((v: void) => {
            expect(v).toBeFalsy();
        });
        const gameSettings: GameSettings = {
            timePerTurn: 10,
            playerName: 'allo',
            botDifficulty: 'easy',
            randomBonus: false,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        service.createGame(gameSettings);
        service.startGame();
        service.stopGame();
        expect().nothing();
    });

    it('should not start new game if game exists', () => {
        const gameSettings: GameSettings = {
            timePerTurn: 10,
            playerName: 'allo',
            botDifficulty: 'easy',
            randomBonus: false,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        service.createGame(gameSettings);
        const gameSpy = spyOn(service, 'stopGame').and.callFake(() => {
            return false;
        });
        service.createGame(gameSettings);
        expect(gameSpy).toHaveBeenCalled();
    });

    it('should not start a game if its an online game', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            opponentName: 'p2',
            randomBonus: false,
            id: '0',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        service.joinOnlineGame(userAuth, onlineGameSettings);
        service.startGame();
        expect().nothing();
    });

    it('should updateLeaderboard when game is done', () => {
        const gameSettings: GameSettings = {
            timePerTurn: 10,
            playerName: 'allo',
            botDifficulty: 'easy',
            randomBonus: false,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        service.createGame(gameSettings);
        (service['game'] as Game)['isEndOfGameSubject'].next();
        expect(leaderboardServiceMock.updateLeaderboard).toHaveBeenCalled();

        service.createSpecialGame(gameSettings);
        (service['game'] as Game)['isEndOfGameSubject'].next();
        expect(leaderboardServiceMock.updateLeaderboard).toHaveBeenCalled();
    });

    it('should not updateLeaderboard if game is undefined', () => {
        const gameSettings: GameSettings = {
            timePerTurn: 10,
            playerName: 'allo',
            botDifficulty: 'easy',
            randomBonus: false,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        service.createGame(gameSettings);
        const game = service['game'] as Game;
        service['game'] = undefined;
        service['createOnlinePlayers'](gameSettings.playerName, 'opponentName');
        game['isEndOfGameSubject'].next();
        expect(leaderboardServiceMock.updateLeaderboard).not.toHaveBeenCalled();
    });

    it('should not updateLeaderboard if players are undefined', () => {
        const players = undefined as unknown;
        service['updateLeaderboard'](players as Player[], GameMode.Classic);
        expect(leaderboardServiceMock.updateLeaderboard).not.toHaveBeenCalled();
    });

    it('should not updateLeaderboard if player is bot', () => {
        const mockbot = jasmine.createSpyObj(EasyBot, ['setActive']);
        const players: Player[] = [mockbot];
        service['updateLeaderboard'](players, GameMode.Classic);
        expect(leaderboardServiceMock.updateLeaderboard).not.toHaveBeenCalled();
    });
});

describe('GameManagerService Online Edition', () => {
    let service: GameManagerService;
    let gameSocketHandler: GameSocketHandlerService;
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute', 'resetDebug']);
    const leaderboardServiceMock = jasmine.createSpyObj('LeaderboardService', ['updateLeaderboard']);
    const mockBotHttpService = jasmine.createSpyObj('BotHttpService', ['getDataInfo']);
    const obs = of(['Test1', 'Test2', 'Test3']);
    mockBotHttpService.getDataInfo.and.returnValue(obs);
    const dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['getDictionary']);
    const dict = new DictionaryService(dictHttpServiceMock);
    const timer: TimerService = jasmine.createSpyObj('TimerService', ['start', 'stop']);
    const board: BoardService = jasmine.createSpyObj('BoardService', [], ['board']);
    const actionCompiler: OnlineActionCompilerService = jasmine.createSpyObj('OnlineActionCompilerService', ['compileActionOnline']);
    const objectiveCreator: ObjectiveCreator = jasmine.createSpyObj('ObjectiveCreator', ['chooseObjectives']);
    const grid: Tile[][] = [];
    for (let i = 0; i < BOARD_DIMENSION; i++) {
        const row: Tile[] = [];
        for (let j = 0; j < BOARD_DIMENSION; j++) {
            row.push(new Tile());
        }
        grid.push([...row]);
    }
    grid[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].letterObject.char = 'X';

    const p1: LightPlayer = {
        letterRack: [
            { char: 'A', value: 0 },
            { char: 'B', value: 0 },
            { char: 'C', value: 0 },
        ],
        name: 'p1',
        points: 123,
    };

    const p2: LightPlayer = {
        letterRack: [
            { char: 'D', value: 0 },
            { char: 'E', value: 0 },
            { char: 'F', value: 0 },
        ],
        name: 'p2',
        points: 456,
    };

    const letterBag: Letter[] = [
        { char: 'G', value: 0 },
        { char: 'H', value: 0 },
        { char: 'I', value: 0 },
    ];

    const forfeitedGameState: ForfeitedGameState = {
        letterBag,
        consecutivePass: 0,
        randomBonus: false,
        players: [p1, p2],
        activePlayerIndex: 0,
        grid,
        lettersRemaining: letterBag.length,
        isEndOfGame: false,
        winnerIndex: [],
        objectives: [],
    };

    const objective: TransitionObjective = {
        description: 'objectiveDescription',
        name: 'Quatre Coins',
        objectiveType: 0,
        owner: undefined,
        points: 20,
        progressions: [
            { playerName: 'p1', progression: 0 },
            { playerName: 'p2', progression: 0 },
        ],
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: CommandExecuterService, useValue: commandExecuterMock },
                { provide: LeaderboardService, useValue: leaderboardServiceMock },
                { provide: BotHttpService, useValue: mockBotHttpService },
            ],
        });
        service = TestBed.inject(GameManagerService);
        gameSocketHandler = TestBed.inject(GameSocketHandlerService);
    });

    it('should join an online game', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            opponentName: 'p2',
            randomBonus: false,
            id: '0',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        service.joinOnlineGame(userAuth, onlineGameSettings);
        const result = service['game'];
        expect(result).toBeInstanceOf(OnlineGame);
    });

    it('should join a special online game', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            opponentName: 'p2',
            randomBonus: false,
            id: '0',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Special,
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        service.joinOnlineGame(userAuth, onlineGameSettings);
        const result = service['game'];
        expect(result).toBeInstanceOf(OnlineGame);
    });

    it('should stop game if offline game exist on join an online game', () => {
        const gameSettings: GameSettings = {
            timePerTurn: 10,
            playerName: 'allo',
            botDifficulty: 'easy',
            randomBonus: false,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };

        service.createGame(gameSettings);
        const gameSpy = spyOn(service, 'stopGame').and.callThrough();
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            opponentName: 'p2',
            randomBonus: false,
            id: '0',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        service.joinOnlineGame(userAuth, onlineGameSettings);
        expect(gameSpy).toHaveBeenCalled();
    });

    it('should stop game if online game exist on join an online game', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            opponentName: 'p2',
            randomBonus: false,
            id: '0',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        const gameSpy = spyOn(service, 'stopGame').and.callThrough();

        service.joinOnlineGame(userAuth, onlineGameSettings);

        service.joinOnlineGame(userAuth, onlineGameSettings);
        expect(gameSpy).toHaveBeenCalled();
    });

    it('should throw error if there is no opponent', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            randomBonus: false,
            id: '0',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        expect(() => service.joinOnlineGame(userAuth, onlineGameSettings)).toThrowError('No opponent name was entered');
    });

    it('should test the disconnectedFromServerSubject subject', () => {
        const result = service.disconnectedFromServer$.subscribe();
        gameSocketHandler['disconnectedFromServerSubject'].next();
        expect(result).toBeTruthy();
    });

    it('should test the forfeitedGameState subject', () => {
        const result = service.forfeitGameState$.subscribe();
        gameSocketHandler['forfeitGameState$'].next();
        expect(result).toBeTruthy();
    });

    it('should join an online game when you are the opponent', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p2',
            opponentName: 'p1',
            randomBonus: false,
            id: '0',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        service.joinOnlineGame(userAuth, onlineGameSettings);
        const result = service['game'];
        expect(result).toBeInstanceOf(OnlineGame);
    });

    it('should stopOnlineGame when onlineGame is undefined', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p2',
            opponentName: 'p1',
            randomBonus: false,
            id: '0',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };
        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };
        service.joinOnlineGame(userAuth, onlineGameSettings);
        const spy = spyOn(service['onlineChat'], 'leaveChatRoom');
        service['stopGame']();
        expect(spy).toHaveBeenCalled();
    });

    it('should not convert and resume an OnlineGame if there was no game', () => {
        service.instanciateGameFromForfeitedState(forfeitedGameState);
        expect(service['game']).toBe(undefined);
    });

    it('should convert and resume an OnlineGame (converted to OfflineGame)', () => {
        forfeitedGameState.grid[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].letterObject.char = 'X';
        service['game'] = new OnlineGame('gameToken', 10000, 'p1', timer, gameSocketHandler, board, actionCompiler);
        spyOn(service['onlineChat'], 'leaveChatRoom').and.callFake(() => {
            return;
        });
        service.instanciateGameFromForfeitedState(forfeitedGameState);
        service.startConvertedGame(forfeitedGameState);
        expect(service['game']).toBeInstanceOf(OfflineGame);
        expect(service['game']['activePlayerIndex']).toBe(forfeitedGameState.activePlayerIndex);
        expect(service['boardService'].board.grid[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].letterObject.char).toBe(
            forfeitedGameState.grid[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].letterObject.char,
        );
    });

    it('should convert and resume a SpecialOnlineGame (converted to SpecialOfflineGame)', () => {
        forfeitedGameState.objectives = [objective];
        service['game'] = new SpecialOnlineGame('gameToken', 10000, 'p1', timer, gameSocketHandler, board, actionCompiler, objectiveCreator);
        spyOn(service['onlineChat'], 'leaveChatRoom').and.callFake(() => {
            return;
        });
        service.instanciateGameFromForfeitedState(forfeitedGameState);
        service.startConvertedGame(forfeitedGameState);
        expect(service['game']).toBeInstanceOf(SpecialOfflineGame);
        expect(service['game']['activePlayerIndex']).toBe(forfeitedGameState.activePlayerIndex);
        expect(service['boardService'].board.grid[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].letterObject.char).toBe(
            forfeitedGameState.grid[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].letterObject.char,
        );
        expect((service['game'] as SpecialOfflineGame).publicObjectives[0].name).toBe(objective.name);
    });

    it('should throw error if game is not created first when resuming a game', () => {
        expect(() => {
            service['resumeGame'](0);
        }).toThrowError('No game created yet');
    });

    it('should not allocate players if there is no game', () => {
        service['allocatePlayers']([new User('p1'), new User('p2')]);
        expect(service['game']?.players).toBe(undefined);
    });
});
