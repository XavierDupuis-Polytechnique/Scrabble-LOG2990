/* tslint:disable:no-unused-variable */

import { ASCII_CODE } from '@app/GameLogic/game/board';
import { Letter } from '@app/GameLogic/game/letter.interface';
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
        const lettersToBeCreated = [];
        let newLetter: Letter;
        for (let i = 0; i < lettersToCreate.length; i++) {
            newLetter = { char: lettersToCreate[i], value: LetterCreator.gameLettersValue[lettersToCreate[i].charCodeAt(0) - ASCII_CODE] };
            lettersToBeCreated.push(newLetter);
        }
        const letterCreated = letterCreator.createLetters(lettersToCreate);
        expect(letterCreated).toEqual(lettersToBeCreated);
    });
});
