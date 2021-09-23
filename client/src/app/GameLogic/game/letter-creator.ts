import { Letter } from 'src/app/GameLogic/game/letter.interface';

// TODO change
const GAME_LETTERS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '*',
];

const INDEX_RECTIFIER = 'A'.charCodeAt(0);
export class LetterCreator {
    static readonly gameLetters = GAME_LETTERS;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    static readonly gameLettersCount = [9, 2, 2, 3, 15, 2, 2, 2, 8, 1, 1, 5, 3, 6, 6, 2, 1, 6, 6, 6, 6, 2, 1, 1, 1, 1, 2];
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    static readonly gameLettersValue = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 10, 1, 2, 1, 1, 3, 8, 1, 1, 1, 1, 4, 10, 10, 10, 10, 0];
    static readonly defaultNumberOfLetters = LetterCreator.gameLettersCount.reduce((sum, current) => sum + current, 0);
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
            value: LetterCreator.gameLettersValue[char.toUpperCase().charCodeAt(0) - this.indexRectifier],
        };
    }

    createBlankLetter(char: string): Letter {
        if (char.length !== 1) {
            throw Error('Invalid char entered');
        }
        return {
            char: char.toUpperCase(),
            value: 0,
        };
    }
}
