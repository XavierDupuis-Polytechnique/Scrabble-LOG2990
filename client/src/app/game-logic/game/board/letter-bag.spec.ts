import { RACK_LETTER_COUNT } from '@app/game-logic/constants';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { LetterBag } from './letter-bag';

describe('LetterBag', () => {
    let letterBag: LetterBag;

    beforeEach(() => {
        letterBag = new LetterBag();
    });

    it('should create an instance with the correct number of GameLetters', () => {
        let totalNumberOfGameLetters = 0;
        letterBag.gameLetters.forEach(() => {
            totalNumberOfGameLetters += 1;
        });
        expect(letterBag.gameLetters.length).toBe(totalNumberOfGameLetters);
    });

    it('should draw the number correct GameLetters when drawing first GameLetters', () => {
        const initialNumberOfGameLetters = letterBag.gameLetters.length;
        expect(letterBag.drawEmptyRackLetters().length).toBe(LetterBag.playerLetterCount);
        expect(letterBag.gameLetters.length).toBe(initialNumberOfGameLetters - LetterBag.playerLetterCount);
    });

    it('should draw the number correct GameLetters when drawing during the game', () => {
        const initialNumberOfGameLetters = letterBag.gameLetters.length;
        const numberOfGameLettersDrawn = letterBag.drawGameLetters(RACK_LETTER_COUNT).length;
        expect(letterBag.gameLetters.length).toBe(initialNumberOfGameLetters - numberOfGameLettersDrawn);
    });

    it('should draw the number correct GameLetters when drawing all the GameLetters during the game', () => {
        const initialNumberOfGameLetters = letterBag.gameLetters.length;
        const numberOfGameLettersDrawn = letterBag.drawGameLetters(letterBag.gameLetters.length).length;
        expect(letterBag.gameLetters.length).toBe(initialNumberOfGameLetters - numberOfGameLettersDrawn);
    });

    it('should not draw more letters than the LetterBag has', () => {
        const initialLetterBagCount = letterBag.gameLetters.length + 0;
        const numberOfGameLettersToBeDrawn = letterBag.gameLetters.length + 1;
        const numberOfGameLettersDrawn = letterBag.drawGameLetters(numberOfGameLettersToBeDrawn).length;
        expect(numberOfGameLettersDrawn).toBe(initialLetterBagCount);
    });

    it('should not draw letters when the LetterBag is empty', () => {
        letterBag.drawGameLetters(letterBag.gameLetters.length);
        const numberOfGameLettersDrawn = letterBag.drawGameLetters().length;
        expect(numberOfGameLettersDrawn).toBe(0);
    });

    it('should return if bag is empty', () => {
        expect(letterBag.isEmpty).toBeFalse();
        letterBag.drawGameLetters(letterBag.gameLetters.length);
        expect(letterBag.isEmpty).toBeTrue();
    });

    it('default draw should pick minimum 1 letter', () => {
        const previousNumberLetter: number = letterBag.gameLetters.length;
        letterBag.drawGameLetters();
        const newNumberLetter: number = letterBag.gameLetters.length;
        expect(previousNumberLetter - 1).toBe(newNumberLetter);
    });

    it('should return the correct letter counts', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'B', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'C', value: 1 },
            { char: 'C', value: 1 },
            { char: '*', value: 1 },
            { char: '-', value: 0 },
        ];
        letterBag.gameLetters = letters;
        const LETTER_A_CODE = 'A'.charCodeAt(0);
        const LETTER_Z_CODE = 'Z'.charCodeAt(0);
        const initialLetterCounts: [string, number][] = [['*', 0]];
        for (let code = LETTER_A_CODE; code <= LETTER_Z_CODE; code++) {
            initialLetterCounts.push([String.fromCharCode(code), 0]);
        }
        const expectedMap = new Map(initialLetterCounts);
        expectedMap.set('A', 3);
        expectedMap.set('B', 1);
        expectedMap.set('C', 2);
        expectedMap.set('*', 1);
        expectedMap.set('-', 1);
        expect(letterBag.countLetters()).toEqual(expectedMap);
    });
});
