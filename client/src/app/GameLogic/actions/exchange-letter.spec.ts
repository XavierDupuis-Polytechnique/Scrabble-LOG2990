import { User } from '@app/GameLogic/player/user';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { ExchangeLetter } from './exchange-letter';

describe('ExchangeLetter', () => {
    let gameManager: GameManagerService;

    beforeEach(() => {
        gameManager = new GameManagerService(new TimerService(), new PointCalculatorService());
        gameManager.createGame({ playerName: 'Tim', timePerTurn: 6000, botDifficulty: 'beginner' });
        gameManager.startGame();
    });

    it('should create an instance', () => {
        const letters: Letter[] = [{ char: 'A', value: 1 }];
        expect(new ExchangeLetter(new User('Tim'), letters)).toBeTruthy();
    });

    it('should change letters', () => {
        const initialLetterRack: Letter[] = gameManager.game.players[0].letterRack;
        const lettersToExchange: Letter[] = initialLetterRack.slice(0, 3);
        const exchangeAction = new ExchangeLetter(gameManager.game.players[0], lettersToExchange);
        exchangeAction.execute(gameManager.game);
        const finalLetterRack: Letter[] = gameManager.game.players[0].letterRack;
        initialLetterRack.sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));
        finalLetterRack.sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));
        expect(initialLetterRack !== finalLetterRack).toBeTrue();
    });
});
