import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';

describe('ExchangeLetter', () => {
    let game: Game;
    const player: Player = new User('Tim');
    beforeEach(() => {
        game = new Game(1, new TimerService(), new PointCalculatorService(), new BoardService());
        game.players[0] = player;
        game.start();
    });

    it('should create an instance', () => {
        const letters: Letter[] = [{ char: 'A', value: 1 }];
        expect(new ExchangeLetter(new User('Tim'), letters)).toBeTruthy();
    });

    it('letter rack should be different when exchanging letters', () => {
        const initialLetterRack: Letter[] = player.letterRack;
        const lettersToExchange: Letter[] = initialLetterRack.slice(0, 3);
        const exchangeAction = new ExchangeLetter(player, lettersToExchange);

        exchangeAction.execute(game);

        const finalLetterRack: Letter[] = player.letterRack;
        initialLetterRack.sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));
        finalLetterRack.sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));

        expect(initialLetterRack !== finalLetterRack).toBeTrue();
    });
});
