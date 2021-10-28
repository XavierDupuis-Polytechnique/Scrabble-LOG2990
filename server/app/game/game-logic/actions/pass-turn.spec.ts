import { PassTurn } from '@app/game/game-logic/actions/pass-turn';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { expect } from 'chai';

describe('PassTurn', () => {
    let game: ServerGame;
    const player1: Player = new Player('Tim');
    const player2: Player = new Player('George');
    const randomBonus = false;
    const pointCalculator = new PointCalculatorService();

    beforeEach(() => {
        game = new ServerGame(randomBonus, 60000, 'default_gameToken', pointCalculator);
        game.players.push(player1);
        game.players.push(player2);
        game.startGame();
    });

    it('should pass turn', () => {
        const beforePlayer: Player = game.getActivePlayer();
        const passAction = new PassTurn(beforePlayer);
        beforePlayer.play(passAction);
        const afterPlayer: Player = game.getActivePlayer();
        expect(beforePlayer.name).not.to.equal(afterPlayer.name);
    });
});
