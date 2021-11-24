/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { DEFAULT_DICTIONARY_TITLE, DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { Game } from '@app/game-logic/game/games/game';
import { GameSettings } from '@app/game-logic/game/games/game-settings.interface';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { EasyBot } from '@app/game-logic/player/bot/easy-bot';
import { Player } from '@app/game-logic/player/player';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
import { BotHttpService } from '@app/services/jv-http.service';
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
        gameSocketHandler['disconnectedFromServerSubject'].next();
        const result = service.disconnectedFromServer$.subscribe();
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
});
