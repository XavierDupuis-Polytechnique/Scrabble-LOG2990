import { LetterBag } from '@app/game/game-logic/board/letter-bag';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { RACK_LETTER_COUNT } from '@app/game/game-logic/constants';
import { expect } from 'chai';

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
        expect(letterBag.gameLetters.length).to.be.equal(totalNumberOfGameLetters);
    });

    it('should draw the number correct GameLetters when drawing first GameLetters', () => {
        const initialNumberOfGameLetters = letterBag.gameLetters.length;
        expect(letterBag.drawEmptyRackLetters().length).to.be.equal(LetterBag.playerLetterCount);
        expect(letterBag.gameLetters.length).to.be.equal(initialNumberOfGameLetters - LetterBag.playerLetterCount);
    });

    it('should draw the number correct GameLetters when drawing during the game', () => {
        const initialNumberOfGameLetters = letterBag.gameLetters.length;
        const numberOfGameLettersDrawn = letterBag.drawGameLetters(RACK_LETTER_COUNT).length;
        expect(letterBag.gameLetters.length).to.be.equal(initialNumberOfGameLetters - numberOfGameLettersDrawn);
    });

    it('should draw the number correct GameLetters when drawing all the GameLetters during the game', () => {
        const initialNumberOfGameLetters = letterBag.gameLetters.length;
        const numberOfGameLettersDrawn = letterBag.drawGameLetters(letterBag.gameLetters.length).length;
        expect(letterBag.gameLetters.length).to.be.equal(initialNumberOfGameLetters - numberOfGameLettersDrawn);
    });

    it('should not draw more letters than the LetterBag has', () => {
        const initialLetterBagCount = letterBag.gameLetters.length + 0;
        const numberOfGameLettersToBeDrawn = letterBag.gameLetters.length + 1;
        const numberOfGameLettersDrawn = letterBag.drawGameLetters(numberOfGameLettersToBeDrawn).length;
        expect(numberOfGameLettersDrawn).to.be.equal(initialLetterBagCount);
    });

    it('should not draw letters when the LetterBag is empty', () => {
        letterBag.drawGameLetters(letterBag.gameLetters.length);
        const numberOfGameLettersDrawn = letterBag.drawGameLetters().length;
        expect(numberOfGameLettersDrawn).to.be.equal(0);
    });

    it('should return if bag is empty', () => {
        expect(letterBag.isEmpty).to.be.equal(false);
        letterBag.drawGameLetters(letterBag.gameLetters.length);
        expect(letterBag.isEmpty).to.be.equal(true);
    });

    it('default draw should pick minimum 1 letter', () => {
        const previousNumberLetter: number = letterBag.gameLetters.length;
        letterBag.drawGameLetters();
        const newNumberLetter: number = letterBag.gameLetters.length;
        expect(previousNumberLetter - 1).to.be.equal(newNumberLetter);
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
        expect(letterBag.countLetters()).to.be.deep.equal(expectedMap);
    });
});
