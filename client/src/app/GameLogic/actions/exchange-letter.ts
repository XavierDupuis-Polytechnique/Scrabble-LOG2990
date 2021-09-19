import { Action } from '@app/GameLogic/actions/action';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Player } from '@app/GameLogic/player/player';

export class ExchangeLetter extends Action {
    // On assume que l'action a ete validee (la reserve contient au moins 7 lettres)
    constructor(player: Player, readonly lettersToExchange: Letter[]) {
        super(player);
    }
    protected perform(game: Game) {
        game.letterBag.drawGameLetters(this.lettersToExchange.length);
        const newLetters: Letter[] = game.letterBag.drawGameLetters(this.lettersToExchange.length);

        const exchangeLetterSet = new Set(this.lettersToExchange);
        const newLetterRack: Letter[] = [];

        for (const letter of this.player.letterRack) {
            if (!exchangeLetterSet.has(letter)) {
                newLetterRack.push({ ...letter });
            }
        }
        for (const letter of newLetters) {
            newLetterRack.push({ ...letter });
        }
        this.player.letterRack = newLetterRack;

        for (const letter of this.lettersToExchange) {
            game.letterBag.addLetter({ ...letter });
        }
    }
}
