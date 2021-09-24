import { TestBed } from '@angular/core/testing';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';

const TIME_PER_TURN = 10;
const MAX_LETTERS_IN_RACK = 7;

describe('Game', () => {
    let game: Game;
    let timerSpy: jasmine.SpyObj<TimerService>;
    let pointCalculatorSpy: jasmine.SpyObj<PointCalculatorService>;
    let boardSpy: jasmine.SpyObj<BoardService>;
    let messageSpy = new MessagesService(new CommandParserService()); // TODO change with spy obj
    let user1: User;
    let user2: User;
    beforeEach(() => {
        timerSpy = jasmine.createSpyObj('TimerService', ['start', 'stop']);
        pointCalculatorSpy = jasmine.createSpyObj('PointCalculatorService', ['endOfGamePointdeduction']);
        boardSpy = jasmine.createSpyObj('BoardService', ['board']);
        messageSpy = jasmine.createSpyObj('MessagesService', ['receiveSystemMessage']);

        TestBed.configureTestingModule({
            providers: [
                { provide: TimerService, useValue: timerSpy },
                { provide: PointCalculatorService, useValue: pointCalculatorSpy },
                { provide: BoardService, useValue: boardSpy },
                { provide: MessagesService, useValue: messageSpy },
            ],
        });
        // const timerService = TestBed.inject(TimerService);
        // const pointCalculatorService = TestBed.inject(PointCalculatorService);
        // const boardService = TestBed.inject(BoardService);
        game = new Game(TIME_PER_TURN, new TimerService(), pointCalculatorSpy, boardSpy, messageSpy);
        user1 = new User('Tim');
        user2 = new User('Paul');
        game.players = [user1, user2];
    });

    it('should create instance', () => {
        expect(new Game(TIME_PER_TURN, timerSpy, pointCalculatorSpy, boardSpy, messageSpy));
    });

    it('#start should throw error when no players', () => {
        game.players = [];
        expect(() => {
            game.start();
        }).toThrowError();
    });

    it('should draw 7 letter @ start', () => {
        game.start();
        expect(user1.letterRack.length).toBe(MAX_LETTERS_IN_RACK);
        expect(user2.letterRack.length).toBe(MAX_LETTERS_IN_RACK);
    });

    it('should end game', () => {
        game.start();
        game.letterBag.gameLetters = [];
        user1.letterRack = [];
        expect(game.isEndOfGame()).toBe(true);
    });
    // TODO changer la function de messageSpy pour qu'il retourne les arguments...
    // On pourra voir ce que game.onEndOfGame() envoie comme message
    it('on game end send message to system', () => {
        game.start();
        game.letterBag.gameLetters = [];
        user1.letterRack = [];
        expect(game.isEndOfGame()).toBe(true);
        if (game.isEndOfGame()) {
            game.onEndOfGame();
        }
        expect(messageSpy.receiveSystemMessage).toHaveBeenCalled();
    });

    // it('should call #endOfGamePointDeduction from pointCalculator', () => {});
});
