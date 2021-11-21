/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { OfflineGame } from '@app/game-logic/game/games/solo-game/offline-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { Observable, Subject } from 'rxjs';
import { GameInfoService } from './game-info.service';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

const passThrough = (map: Map<string, number>): Map<string, number> => {
    return map;
};

describe('GameInfoService', () => {
    let service: GameInfoService;
    let game: OfflineGame;
    let specialGame: jasmine.SpyObj<SpecialOfflineGame>;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let board: BoardService;
    let messages: MessagesService;
    const dict = new DictionaryService();
    const randomBonus = false;
    const mockEndOfTurn$ = new Subject<void>();
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: dict }],
        });
        service = TestBed.inject(GameInfoService);
        timer = TestBed.inject(TimerService);
        board = TestBed.inject(BoardService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        messages = TestBed.inject(MessagesService);
        specialGame = jasmine.createSpyObj('SpecialOfflineGame', ['start'], ['endTurn$']);

        (Object.getOwnPropertyDescriptor(specialGame, 'endTurn$')?.get as jasmine.Spy<() => Observable<void>>).and.returnValue(mockEndOfTurn$);

        game = new OfflineGame(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculator, board, messages);
        game.players = [new User('p1'), new User('p2')];
        game.start();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw Error for getPlayer() if no players were received', () => {
        for (let i = 0; i < game.players.length; i++) {
            expect(() => {
                service.getPlayer(i);
            }).toThrowError('No Players in GameInfo');
        }
    });

    it('should throw Error for getPlayerScore() if no players were received', () => {
        for (let i = 0; i < game.players.length; i++) {
            expect(() => {
                service.getPlayerScore(i);
            }).toThrowError('No Players in GameInfo');
        }
    });

    it('should throw Error for activePlayer if no players were received', () => {
        expect(() => {
            const p = service.activePlayer;
            p.toString();
        }).toThrowError('No Players in GameInfo');
    });

    it('should throw Error for numberOfPlayers if no players were received', () => {
        expect(() => {
            const n = service.numberOfPlayers;
            n.toString();
        }).toThrowError('No Players in GameInfo');
    });

    it('should throw Error for numberOfLettersRemaining if no game was received', () => {
        expect(() => {
            const n = service.numberOfLettersRemaining;
            n.toString();
        }).toThrowError('No Game in GameInfo');
    });

    it('should throw Error if no game was received on letterOcurrence call', () => {
        expect(() => {
            const n = service.letterOccurences;
            n.toString();
        }).toThrowError('No Game in GameInfo');
    });

    it('should return the time left for a turn from the Timer', () => {
        expect(service.timeLeftForTurn).toBeTruthy();
    });

    it('should properly store the user', () => {
        const user = new User('p1');
        service.receiveUser(user);
        expect(service.user).toBeTruthy();
        expect(service.user.name).toBe(user.name);
    });

    it('should return the player with provided index', () => {
        service.receiveGame(game);
        expect(service.getPlayer(0)).toEqual(game.players[0]);
        expect(service.getPlayer(1)).toEqual(game.players[1]);
    });

    it('should return the player points with provided index', () => {
        service.receiveGame(game);
        game.players[0].points = Math.floor(Math.random() * 1000);
        game.players[1].points = Math.floor(Math.random() * 1000);
        expect(service.getPlayerScore(0)).toBe(game.players[0].points);
        expect(service.getPlayerScore(1)).toBe(game.players[1].points);
    });

    it('should return the number of players', () => {
        service.players = [new User('p1'), new User('p2')];
        expect(service.numberOfPlayers).toBe(service.players.length);
    });

    it('should return the end of the game flag', () => {
        service.receiveGame(game);
        expect(service.isEndOfGame).toBeFalsy();
        game.letterBag.gameLetters = [];
        service.players[0].letterRack = [];
        expect(service.isEndOfGame).toBeTruthy();
    });

    it('should return the winner of the game', () => {
        service.receiveGame(game);
        game.players[1].points = Number.MAX_SAFE_INTEGER;
        spyOn(game, 'getWinner').and.returnValue([game.players[1]]);
        expect(service.winner).toEqual([game.players[1]]);
    });

    it('should call #countLetters from letterBag', () => {
        service.receiveGame(game);
        const spy = spyOn(game.letterBag, 'countLetters');
        passThrough(service.letterOccurences);
        expect(spy).toHaveBeenCalled();
    });

    it('should return the number of letters remaining', () => {
        service.receiveGame(game);
        const result = service.numberOfLettersRemaining;
        const expected = 88;
        expect(result).toEqual(expected);
    });

    it('should get the active player', () => {
        game.activePlayerIndex = 0;
        service.receiveGame(game);
        const result = service.activePlayer;
        const expected = game.players[0];
        expect(result).toEqual(expected);
    });

    it('should return that the game is not online', () => {
        service.receiveGame(game);
        const result = service.isOnlineGame;
        expect(result).toBeFalsy();
    });

    it('should get the gameId offline', () => {
        service.receiveGame(game);
        const result = service.gameId;
        const expected = '';
        expect(result).toEqual(expected);
    });

    it('should test the endTurn$ arrow function', () => {
        service.receiveGame(game);
        game['endTurnSubject'].next();
        const result = service.endTurn$.subscribe();
        expect(result).toBeTruthy();
    });

    it('letter occurences should return an empty map when the game type is unsupported', () => {
        service['game'] = {} as unknown as OfflineGame;
        expect(service.letterOccurences.size).toBe(0);
    });

    it('should get timeLeft percentage properly', () => {
        expect(service.timeLeftPercentForTurn).toBeInstanceOf(Observable);
    });

    it('winner should throw error when no game', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-expressions
            service.winner;
        }).toThrow();
    });

    it('gameID should throw when there is no game', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-expressions
            service.gameId;
        }).toThrow();
    });

    it('private objective should throw when no game', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-expressions
            service.privateObjectives;
        }).toThrow();
    });

    it('should return isSpecial game properly', () => {
        const realSpecialGame = new SpecialOfflineGame(
            false,
            1000,
            jasmine.createSpyObj('TimerService', ['start']),
            jasmine.createSpyObj('PointCalculatorService', ['placeLetterCalculation']),
            jasmine.createSpyObj('BoardService', [], ['board']),
            jasmine.createSpyObj('MessagesService', ['receiveMessage']),
            jasmine.createSpyObj('ObjectiveCreator', ['chooseObjectives']),
        );
        service.receiveGame(realSpecialGame);
        expect(service.isSpecialGame).toBeTrue();
    });

    it('should return private objectives properly', () => {
        specialGame.privateObjectives = new Map<string, Objective[]>();
        const mockObjective = {} as unknown as Objective;
        specialGame.privateObjectives.set('p1', [mockObjective, mockObjective]);
        service.receiveGame(specialGame);
        const user = new User('p1');
        service.receiveUser(user);
        expect(service.privateObjectives.length).toBe(2);
    });

    it('should return public objectives properly', () => {
        const mockObjective = {} as unknown as Objective;
        specialGame.publicObjectives = [mockObjective, mockObjective];
        service.receiveGame(specialGame);
        const user = new User('p1');
        service.receiveUser(user);
        expect(service.publicObjectives.length).toBe(2);
    });

    it('should return 0 private objectives when user not found', () => {
        specialGame.privateObjectives = new Map<string, Objective[]>();
        const mockObjective = {} as unknown as Objective;
        specialGame.privateObjectives.set('p2', [mockObjective, mockObjective]);
        service.receiveGame(specialGame);
        const user = new User('p1');
        service.receiveUser(user);
        expect(service.privateObjectives.length).toBe(0);
    });

    it('should throw when getting public objective when no game', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-expressions
            service.publicObjectives;
        }).toThrow();
    });
});

describe('GameInfoService Online Edition', () => {
    let service: GameInfoService;
    let onlineGame: OnlineGame;
    let timer: TimerService;
    let board: BoardService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameInfoService);
        timer = TestBed.inject(TimerService);
        board = TestBed.inject(BoardService);

        onlineGame = new OnlineGame(
            '0',
            DEFAULT_TIME_PER_TURN,
            'QWERTY',
            timer,
            new GameSocketHandlerService(),
            board,
            TestBed.inject(OnlineActionCompilerService),
        );
        onlineGame.players = [new User('p1'), new User('p2')];
    });

    it('should return the number of letters remaining', () => {
        service.receiveGame(onlineGame);
        const result = service.numberOfLettersRemaining;
        const expected = 0;
        expect(result).toEqual(expected);
    });

    it('should get the active player', () => {
        onlineGame.players = [new User('p1'), new User('p2')];
        onlineGame.activePlayerIndex = 0;
        service.receiveGame(onlineGame);
        const result = service.activePlayer;
        const expected = onlineGame.players[0];
        expect(result).toEqual(expected);
    });

    it('should get the endOfGame status', () => {
        service.receiveGame(onlineGame);
        const result = service.isEndOfGame;
        const expected = false;
        expect(result).toEqual(expected);
    });

    it('should get the winner', () => {
        const p1 = new User('p1');
        spyOn(onlineGame, 'getWinner').and.returnValue([p1]);
        service.receiveGame(onlineGame);
        const result = service.winner;
        const expected: Player[] = [p1];
        expect(result).toEqual(expected);
    });

    it('should return that the game is online', () => {
        service.receiveGame(onlineGame);
        const result = service.isOnlineGame;
        expect(result).toBeTruthy();
    });

    it('should get the gameId online', () => {
        service.receiveGame(onlineGame);
        const result = service.gameId;
        const expected = '0';
        expect(result).toEqual(expected);
    });
});
