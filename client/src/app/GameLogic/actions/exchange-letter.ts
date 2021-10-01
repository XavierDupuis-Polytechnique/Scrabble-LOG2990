import { Action } from '@app/GameLogic/actions/action';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';

export class ExchangeLetter extends Action {
    // On assume que l'action a ete validee (la reserve contient au moins 7 lettres)
    constructor(player: Player, readonly lettersToExchange: Letter[]) {
        super(player);
    }
    protected perform(game: Game) {
        const lettersFromBag: Letter[] = game.letterBag.drawGameLetters(this.lettersToExchange.length);
        const rackLettersToExchange = this.player.getLettersFromRack(this.lettersToExchange);
        const exchangeLetterSet = new Set(rackLettersToExchange);
        const nLettersInRack = this.player.letterRack.length;
        let letterToAddIndex = 0;
        for (let letterIndex = 0; letterIndex < nLettersInRack; letterIndex++) {
            const letter = this.player.letterRack[letterIndex];
            if (exchangeLetterSet.has(letter)) {
                const newLetter = lettersFromBag[letterToAddIndex];
                this.player.letterRack[letterIndex] = newLetter;
                letterToAddIndex++;
            }

            if (letterToAddIndex >= lettersFromBag.length) {
                break;
            }
        }

        for (const letter of this.lettersToExchange) {
            game.letterBag.addLetter({ ...letter });
        }
        this.end();
    }
}
