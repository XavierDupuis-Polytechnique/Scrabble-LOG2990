import { LetterBag } from './letter-bag';

describe('LetterBag', () => {
    let letterBag: LetterBag;

    beforeEach(() => {
        letterBag = new LetterBag();
    });

    it('should create an instance with the correct number of GameLetters', () => {
        let totalNumberOfGameLetters = 0;
        LetterBag.gameLettersCount.forEach((gameLetterCount) => {
            totalNumberOfGameLetters += gameLetterCount;
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
        const numberOfGameLettersDrawn = letterBag.drawGameLetters(letterBag.getRandomInt(initialNumberOfGameLetters)).length;
        expect(letterBag.gameLetters.length).toBe(initialNumberOfGameLetters - numberOfGameLettersDrawn);
    });

    it('should draw the number correct GameLetters when drawing all the GameLetters during the game', () => {
        const initialNumberOfGameLetters = letterBag.gameLetters.length;
        const numberOfGameLettersDrawn = letterBag.drawGameLetters(letterBag.gameLetters.length).length;
        expect(letterBag.gameLetters.length).toBe(initialNumberOfGameLetters - numberOfGameLettersDrawn);
    });

    it('should return an error when no more GameLetters can be drawn', () => {
        const numberOfGameLettersToBeDrawn = letterBag.gameLetters.length + 1;
        const gameLettersBagError = new Error(
            'Not enough GameLetters in bag (' + letterBag.gameLetters.length + ') to draw ' + numberOfGameLettersToBeDrawn + ' GameLetters.',
        );

        expect(() => {
            letterBag.drawGameLetters(numberOfGameLettersToBeDrawn);
        }).toThrow(gameLettersBagError);
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
});
