import { TestBed } from '@angular/core/testing';
import { OnlineActionCompilerService } from '@app/GameLogic/actions/online-action-compiler.service';
import { DEFAULT_TIME_PER_TURN, THOUSAND } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Game } from '@app/GameLogic/game/games/game';
import { OnlineGame } from '@app/GameLogic/game/games/online-game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { GameInfoService } from './game-info.service';

const passThrough = (map: Map<string, number>): Map<string, number> => {
    return map;
};

describe('GameInfoService', () => {
    let service: GameInfoService;
    let game: Game;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let board: BoardService;
    let messages: MessagesService;
    const dict = new DictionaryService();
    const randomBonus = false;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: dict }],
        });
        service = TestBed.inject(GameInfoService);
        timer = TestBed.inject(TimerService);
        board = TestBed.inject(BoardService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        messages = TestBed.inject(MessagesService);

        game = new Game(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculator, board, messages);
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
        game.players[0].points = Math.floor(Math.random() * THOUSAND);
        game.players[1].points = Math.floor(Math.random() * THOUSAND);
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

    // it('should test the endTurn$ .next function', () => {
    //     const aaa = new Subject<void>();
    //     (Object.getOwnPropertyDescriptor(game, 'endTurnSubject')?.get as jasmine.Spy<() => Observable<void>>).and.returnValue(aaa);
    //     service.receiveGame(game);
    //     service.endTurnSubject.subscribe();
    //     expect().nothing();
    // });
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
        service.receiveOnlineGame(onlineGame);
        const result = service.numberOfLettersRemaining;
        const expected = 0;
        expect(result).toEqual(expected);
    });

    it('should get the active player', () => {
        onlineGame.players = [new User('p1'), new User('p2')];
        onlineGame.activePlayerIndex = 0;
        service.receiveOnlineGame(onlineGame);
        const result = service.activePlayer;
        const expected = onlineGame.players[0];
        expect(result).toEqual(expected);
    });

    it('should get the endOfGame status', () => {
        service.receiveOnlineGame(onlineGame);
        const result = service.isEndOfGame;
        const expected = false;
        expect(result).toEqual(expected);
    });

    it('should get the winner', () => {
        const p1 = new User('p1');
        spyOn(onlineGame, 'getWinner').and.returnValue([p1]);
        service.receiveOnlineGame(onlineGame);
        const result = service.winner;
        const expected: Player[] = [p1];
        expect(result).toEqual(expected);
    });

    // it('should test the endTurn$', () => {
    //     service.receiveOnlineGame(onlineGame);
    //     const result = service.endTurn$.subscribe();
    //     expect(result).toBeTruthy();
    // });
});
