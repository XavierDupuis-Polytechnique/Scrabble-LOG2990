import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';
import { PassTurn } from './pass-turn';

describe('PassTurn', () => {
    let game: Game;
    const player1: Player = new User('Tim');
    const player2: Player = new User('George');
    beforeEach(() => {
        game = new Game(1, new TimerService(), new PointCalculatorService(), new BoardService());
        game.players.push(player1);
        game.players.push(player2);

        game.start();
    });

    it('should create an instance', () => {
        expect(new PassTurn(new User('Tim'))).toBeTruthy();
    });

    it('should pass turn', () => {
        const beforePlayer: Player = game.getActivePlayer();
        const passAction = new PassTurn(game.getActivePlayer());
        passAction.execute(game);
        const afterPlayer: Player = game.getActivePlayer();
        expect(beforePlayer.name !== afterPlayer.name).toBeTrue();
    });
});
