import { LetterBag } from './letter-bag';

describe('LetterBag', () => {
    let letterBag: LetterBag;

    beforeEach(() => {
        letterBag = new LetterBag();
    });

    it('should create an instance with the correct number of GameLetters', () => {
        expect(LetterBag).toBeTruthy();
        let totalNumberOfGameLetters = 0;
        LetterBag.gameLettersCount.forEach((gameLetterCount) => (totalNumberOfGameLetters += gameLetterCount));
        expect(letterBag.gameLettersBag.length).toBe(totalNumberOfGameLetters);
    });

    it('should draw the number correct GameLetters when drawing first GameLetters', () => {
        const initialNumberOfGameLetters = letterBag.gameLettersBag.length;
        expect(letterBag.drawGameGameLetters().length).toBe(LetterBag.playerGameLetterCount);
        expect(letterBag.gameLettersBag.length).toBe(initialNumberOfGameLetters - LetterBag.playerGameLetterCount);
    });

    it('should draw the number correct GameLetters when drawing during the game', () => {
        const initialNumberOfGameLetters = letterBag.gameLettersBag.length;
        const numberOfGameLettersDrawn = letterBag.drawGameLetters(letterBag.getRandomInt(initialNumberOfGameLetters)).length;
        expect(letterBag.gameLettersBag.length).toBe(initialNumberOfGameLetters - numberOfGameLettersDrawn);
    });

    it('should draw the number correct GameLetters when drawing all the GameLetters during the game', () => {
        const initialNumberOfGameLetters = letterBag.gameLettersBag.length;
        const numberOfGameLettersDrawn = letterBag.drawGameLetters(letterBag.gameLettersBag.length).length;
        expect(letterBag.gameLettersBag.length).toBe(initialNumberOfGameLetters - numberOfGameLettersDrawn);
    });

    it('should return an error when no more GameLetters can be drawn', () => {
        const numberOfGameLettersToBeDrawn = letterBag.gameLettersBag.length + 1;
        const GameLettersBagError = new Error(
            'Not enough GameLetters in bag (' + letterBag.gameLettersBag.length + ') to draw ' + numberOfGameLettersToBeDrawn + ' GameLetters.',
        );
        expect(function () {
            letterBag.drawGameLetters(numberOfGameLettersToBeDrawn).length;
        }).toThrow(GameLettersBagError);
    });
});
