/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { RACK_LETTER_COUNT } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
const TIME_PER_TURN = 10;

describe('Game', () => {
    let game: OfflineGame;
    let timerSpy: TimerService;
    const randomBonus = false;
    let pointCalculatorSpy: jasmine.SpyObj<PointCalculatorService>;
    let boardSpy: jasmine.SpyObj<BoardService>;
    let messageSpy: jasmine.SpyObj<MessagesService>;
    let user1: User;
    let user2: User;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MessagesService, PointCalculatorService, BoardService, TimerService, PointCalculatorService],
        });
        timerSpy = TestBed.inject(TimerService);
        pointCalculatorSpy = jasmine.createSpyObj('PointCalculatorService', ['endOfGamePointDeduction']);
        boardSpy = jasmine.createSpyObj('BoardService', ['board']);
        messageSpy = jasmine.createSpyObj('MessagesService', ['receiveSystemMessage', 'onEndOfGame']);
        game = new OfflineGame(randomBonus, TIME_PER_TURN, timerSpy, pointCalculatorSpy, boardSpy, messageSpy);
        user1 = new User('Tim');
        user2 = new User('Paul');
        game.players = [user1, user2];
    });

    it('should create instance', () => {
        expect(game).toBeTruthy();
    });

    it('should not create instance', () => {
        const forfeitedGame = new OfflineGame(randomBonus, TIME_PER_TURN, timerSpy, pointCalculatorSpy, boardSpy, messageSpy, true);
        expect(forfeitedGame.board).toBeUndefined();
    });

    it('#start should throw error when no players', () => {
        game.players = [];
        expect(() => {
            game.start();
        }).toThrowError();
    });

    it('should draw 7 letter @ start', () => {
        game.start();
        expect(user1.letterRack.length).toBe(RACK_LETTER_COUNT);
        expect(user2.letterRack.length).toBe(RACK_LETTER_COUNT);
    });

    it('should end game when letter bag is empty and one player rack is empty', () => {
        game.start();
        game.letterBag.gameLetters = [];
        user1.letterRack = [];
        expect(game.isEndOfGame()).toBe(true);
    });

    it('should not end game when letter bag is empty and one player rack not empty', () => {
        game.start();
        game.letterBag.gameLetters = [];
        user1.letterRack = [{ char: 'J', value: 1 }];
        expect(game.isEndOfGame()).toBe(false);
    });

    it('on game end send message to system', () => {
        game.start();
        game.letterBag.gameLetters = [];
        user1.letterRack = [];
        expect(game.isEndOfGame()).toBe(true);
        if (game.isEndOfGame()) {
            game['onEndOfGame']();
        }
        expect(messageSpy.receiveSystemMessage).toHaveBeenCalled();
    });

    it('should end game when pass are called a number of time (6) ', () => {
        game.start();
        game.consecutivePass = 6;
        expect(game.isEndOfGame()).toBe(true);
    });

    it('action should call onEndOfGame if it is end of game', () => {
        game.start();
        game.consecutivePass = 5;
        const passAction = new PassTurn(game.getActivePlayer());
        game.getActivePlayer().play(passAction);
        const isEndGame = game.isEndOfGame();
        expect(isEndGame).toBeTrue();
    });

    it('next player should return next player', () => {
        game.start();
        const currentPlayer = game.getActivePlayer();
        game['nextPlayer']();
        const nextPlayer = game.getActivePlayer();
        const isSamePlayer = currentPlayer === nextPlayer;
        expect(isSamePlayer).toBeFalse();
    });

    it('isEndOfGame should return false if not end of game', () => {
        game.start();
        const isEndOfGame = game.isEndOfGame();
        expect(isEndOfGame).toBeFalse();
    });

    it('if action different than pass, should reset pass counter', () => {
        game.consecutivePass = 3;
        const action = new ExchangeLetter(game.players[0], game.players[0].letterRack);
        action.execute(game);
        expect(game.consecutivePass).toBe(0);
    });

    it('getWinner should return the right winner', () => {
        game.players[0].points = 5;
        const winners = game.getWinner();
        expect(winners.length).toBe(1);
        expect(winners[0].name).toBe('Tim');
    });

    it('getWinner should return both winner when same score', () => {
        game.players[0].points = 10;
        game.players[1].points = 10;
        const winners = game.getWinner();
        expect(winners.length).toBe(2);
    });

    it('action from player should end his turn and change to next player', () => {
        game.start();
        const currentPlayer = game.getActivePlayer();
        const action = new PassTurn(currentPlayer);
        currentPlayer.play(action);
        const nextPlayer = game.getActivePlayer();
        const isSamePlayer = currentPlayer.name === nextPlayer.name;
        expect(isSamePlayer).toBeFalse();
    });

    it('game should not resume if no players', () => {
        game.players = [];
        expect(() => {
            game.resume(0);
        }).toThrowError();
    });

    it('game should resume', () => {
        spyOn(game, 'start');
        game.resume(0);
        expect(game.start).not.toHaveBeenCalled();
    });
});
