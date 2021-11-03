import { TestBed } from '@angular/core/testing';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { DEFAULT_TIME_PER_TURN } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';

describe('PassTurn', () => {
    let game: Game;
    const player1: Player = new User('Tim');
    const player2: Player = new User('George');
    const randomBonus = false;
    const dict = new DictionaryService();
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [{ provide: DictionaryService, useValue: dict }] });
        const messageService = TestBed.inject(MessagesService);
        const timerService = TestBed.inject(TimerService);
        const pointCalulatorService = TestBed.inject(PointCalculatorService);
        const boardService = TestBed.inject(BoardService);
        game = new Game(randomBonus, DEFAULT_TIME_PER_TURN, timerService, pointCalulatorService, boardService, messageService);
        game.players.push(player1);
        game.players.push(player2);
    });

    it('should create an instance', () => {
        expect(new PassTurn(new User('Tim'))).toBeTruthy();
    });

    it('should pass turn', () => {
        game.start();
        const beforePlayer: Player = game.getActivePlayer();
        const passAction = new PassTurn(beforePlayer);
        beforePlayer.play(passAction);
        const afterPlayer: Player = game.getActivePlayer();
        expect(beforePlayer.name).not.toBe(afterPlayer.name);
    });
});
