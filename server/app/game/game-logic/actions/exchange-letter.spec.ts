import { ExchangeLetter } from '@app/game/game-logic/actions/exchange-letter';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { expect } from 'chai';

describe('ExchangeLetter', () => {
    let game: ServerGame;
    const player1: Player = new Player('Tim');
    const player2: Player = new Player('George');
    const randomBonus = false;
    let activePlayer: Player;
    const pointCalculator = new PointCalculatorService();

    beforeEach(() => {
        game = new ServerGame(randomBonus, 60000, 'default_gameToken', pointCalculator);
        game.players.push(player1);
        game.players.push(player2);
        game.startGame();
        activePlayer = game.getActivePlayer();
    });

    it('letter rack should be different when exchanging letters', () => {
        const initialLetterRack: Letter[] = [...activePlayer.letterRack];
        const lettersToExchange: Letter[] = initialLetterRack.slice(0, 3);
        const exchangeAction = new ExchangeLetter(activePlayer, lettersToExchange);

        exchangeAction.execute(game);

        const finalLetterRack: Letter[] = activePlayer.letterRack;
        initialLetterRack.sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));
        finalLetterRack.sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));

        expect(initialLetterRack).not.to.deep.equal(finalLetterRack);
    });
});
