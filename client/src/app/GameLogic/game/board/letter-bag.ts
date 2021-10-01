import { RACK_LETTER_COUNT } from '@app/GameLogic/constants';
import { LetterCreator } from './letter-creator';
import { Letter } from './letter.interface';

export class LetterBag {
    static readonly playerLetterCount = RACK_LETTER_COUNT;

    gameLetters: Letter[] = [];
    private letterCreator: LetterCreator = new LetterCreator();
    constructor() {
        for (let letterIndex = 0; letterIndex < LetterCreator.gameLetters.length; letterIndex++) {
            for (let count = 0; count < LetterCreator.gameLettersCount[letterIndex]; count++) {
                const letter = LetterCreator.gameLetters[letterIndex];
                this.gameLetters.push(this.letterCreator.createLetter(letter));
            }
        }
    }

    drawEmptyRackLetters(): Letter[] {
        return this.drawGameLetters(LetterBag.playerLetterCount);
    }

    drawGameLetters(numberOfLetterDesired: number = 1): Letter[] {
        const numberOfLetterToDraw = Math.min(numberOfLetterDesired, this.gameLetters.length);
        const drawedGameLetters: Letter[] = [];
        let drawedGameLetterIndex = -1;
        for (let i = 0; i < numberOfLetterToDraw; i++) {
            drawedGameLetterIndex = Math.floor(Math.random() * this.gameLetters.length);
            drawedGameLetters.push(this.gameLetters.splice(drawedGameLetterIndex, 1)[0]);
        }
        return drawedGameLetters;
    }

    addLetter(letter: Letter) {
        this.gameLetters.push(letter);
    }

    get lettersLeft(): number {
        return this.gameLetters.length;
    }

    get isEmpty(): boolean {
        return this.gameLetters.length === 0;
    }
}
