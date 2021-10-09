import { TestBed } from '@angular/core/testing';
import { DEFAULT_TIME_PER_TURN, THOUSAND } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
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
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MessagesService,
                PointCalculatorService,
                BoardService,
                DictionaryService,
                TimerService,
                GameInfoService,
                PointCalculatorService,
            ],
        });
        service = TestBed.inject(GameInfoService);
        timer = TestBed.inject(TimerService);
        board = TestBed.inject(BoardService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        messages = TestBed.inject(MessagesService);

        game = new Game(DEFAULT_TIME_PER_TURN, timer, pointCalculator, board, messages);
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
        // eslint-disable-next-line no-unused-vars
        passThrough(service.letterOccurences);
        expect(spy).toHaveBeenCalled();
    });
});
