import { Action } from '@app/game/game-logic/actions/action';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { Player } from '@app/game/game-logic/player/player';

export class ExchangeLetter extends Action {
    constructor(player: Player, readonly lettersToExchange: Letter[]) {
        super(player);
    }

    protected perform(game: ServerGame) {
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
