import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';

describe('PassTurn', () => {
    let gameManager: GameManagerService;

    beforeEach(() => {
        gameManager = new GameManagerService(new TimerService(), new PointCalculatorService());
        gameManager.createGame({ playerName: 'Tim', timePerTurn: 6000, botDifficulty: 'beginner' });
        gameManager.startGame();
    });

    it('should create an instance', () => {
        expect(new PassTurn(new User('Tim'))).toBeTruthy();
    });

    it('should pass turn', () => {
        const beforePlayer: Player = gameManager.game.getActivePlayer();
        const passAction = new PassTurn(new User('Tim'));
        passAction.execute(gameManager.game);
        const afterPlayer: Player = gameManager.game.getActivePlayer();
        expect(beforePlayer.name !== afterPlayer.name).toBeTrue();
    });
});
