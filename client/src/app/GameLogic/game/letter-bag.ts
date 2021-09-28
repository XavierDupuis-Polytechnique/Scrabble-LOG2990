import { LetterCreator } from './letter-creator';
import { Letter } from './letter.interface';

export const PLAYER_LETTER_COUNT = 7;

export class LetterBag {
    static readonly playerLetterCount = PLAYER_LETTER_COUNT;

    gameLetters: Letter[] = [];
    private letterCreator: LetterCreator = new LetterCreator();
    constructor() {
        for (let letterIndex = 0; letterIndex < LetterCreator.gameLetters.length; letterIndex++) {
            for (let count = 0; count < LetterCreator.gameLettersCount[letterIndex]; count++) {
                const letter = LetterCreator.gameLetters[letterIndex];
                this.gameLetters.push(this.letterCreator.createLetter(letter));
            }
        }
        this.displayNumberGameLettersLeft();
    }

    displayNumberGameLettersLeft() {
        // console.log('There are ' + this.gameLetters.length + ' GameLetters left');
    }

    drawEmptyRackLetters(): Letter[] {
        return this.drawGameLetters(LetterBag.playerLetterCount);
    }

    drawGameLetters(numberOfLetterDesired: number = 1): Letter[] {
        const numberOfLetterToDraw = Math.min(numberOfLetterDesired, this.gameLetters.length);
        const drawedGameLetters: Letter[] = [];
        let drawedGameLetterIndex = -1;
        for (let i = 0; i < numberOfLetterToDraw; i++) {
            drawedGameLetterIndex = this.getRandomInt(this.gameLetters.length);
            drawedGameLetters.push(this.gameLetters.splice(drawedGameLetterIndex, 1)[0]);
        }
        return drawedGameLetters;
    }

    addLetter(letter: Letter) {
        this.gameLetters.push(letter);
    }

    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    get lettersLeft(): number {
        return this.gameLetters.length;
    }

    get isEmpty(): boolean {
        return this.gameLetters.length === 0;
    }
}
