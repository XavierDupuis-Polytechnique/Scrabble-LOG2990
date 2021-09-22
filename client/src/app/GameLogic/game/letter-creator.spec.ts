/* tslint:disable:no-unused-variable */

import { ASCII_CODE } from '@app/GameLogic/game/board';
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
        const lettersToCreate: string[] = ['A', 'B', 'C'];
        const lettersCreated = [];
        for (const letter in lettersToCreate) {
            lettersCreated.push({ char: letter, value: LetterCreator.gameLettersValue[letter.charCodeAt(0) - ASCII_CODE] });
        }
        expect(letterCreator.createLetters(lettersToCreate)).toEqual(lettersCreated);
    });
});
