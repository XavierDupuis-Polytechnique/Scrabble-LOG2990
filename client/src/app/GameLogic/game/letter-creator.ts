import { LetterBag } from '@app/GameLogic/game/letter-bag';
import { Letter } from 'src/app/GameLogic/game/letter.interface';

// TODO change
const INDEX_RECTIFIER = 'A'.charCodeAt(0);
export class LetterCreator {
    indexRectifier = INDEX_RECTIFIER;
    createLetters(chars: string[]) {
        const lettersToExchange: Letter[] = [];

        if (chars === null) {
            throw Error('null chars were given');
        }

        if (chars.length === 0) {
            throw Error('No chars were given');
        }

        for (const char of chars) {
            const letter = this.createLetter(char);
            lettersToExchange.push(letter);
        }
        return lettersToExchange;
    }

    createLetter(char: string): Letter {
        if (char.length !== 1) {
            throw Error('Invalid char entered');
        }
        return {
            char: char.toUpperCase(),
            value: LetterBag.gameLettersValue[char.charCodeAt(0) - this.indexRectifier],
        };
    }
}
