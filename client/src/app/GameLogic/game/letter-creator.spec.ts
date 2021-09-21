/* tslint:disable:no-unused-variable */

import { LetterCreator } from './letter-creator';

describe('Service: LetterCreator', () => {
    let letterCreator: LetterCreator;
    beforeEach(() => {
        letterCreator = new LetterCreator();
    });

    it('should create instance', () => {
        expect(new LetterCreator()).toBeTruthy();
    });

    it('should create letters', () => {
        // const lettersToCreate: string[] = ['A', 'B', 'C'];
        // const lettersCreated = [{ char: 'A', value: 1}, { char: 'B', value: 1}, { char: 'C', value: 1}]
        // expect(letterCreator.createLetters(lettersToCreate)).toEqual(lettersCreated);
    });
});
