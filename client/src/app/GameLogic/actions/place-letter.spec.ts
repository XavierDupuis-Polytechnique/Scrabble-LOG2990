import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { PlaceLetter, PlacementSetting } from './place-letter';

describe('PlaceLetter', () => {
    let gameManager: GameManagerService;
    const letterToPlace: Letter[] = [
        { char: 'A', value: 1 },
        { char: 'L', value: 1 },
        { char: 'L', value: 1 },
        { char: 'O', value: 1 },
    ];

    const placement: PlacementSetting = {
        x: 0,
        y: 0,
        direction: 'H',
    };
    beforeEach(() => {
        gameManager = new GameManagerService(new TimerService(), new PointCalculatorService());
        gameManager.createGame({ playerName: 'Tim', botDifficulty: 'beginner', timePerTurn: 6000 });
        gameManager.startGame();
    });

    it('should create an instance', () => {
        expect(new PlaceLetter(new User('Tim'), letterToPlace, placement)).toBeTruthy();
    });

    it('should place letter', () => {
        const placeAction = new PlaceLetter(gameManager.game.players[0], letterToPlace, placement);
        placeAction.execute(gameManager.game);
        for (let i = 0; i < letterToPlace.length; i++) {
            expect(gameManager.game.board.grid[i][0].letterObject.char).toBe(letterToPlace[i].char);
        }
    });
});
