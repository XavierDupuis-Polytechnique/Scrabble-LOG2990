/* tslint:disable:no-unused-variable */

import { ASCII_CODE } from '@app/game-logic/constants';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { LetterCreator } from './letter-creator';

describe('Service: LetterCreator', () => {
    let letterCreator: LetterCreator;
    let undefinedChar: string;
    const undefinedLongChar: string[] = [];
    const emptyLongChar: string[] = ['C'];
    const emptyChar = '';
    const str = 'ABC';
    beforeEach(() => {
        letterCreator = new LetterCreator();
        emptyLongChar.pop();
    });

    it('should create instance', () => {
        expect(new LetterCreator()).toBeTruthy();
    });

    it('should throw error No char were given if char is undefined', () => {
        expect(() => {
            letterCreator.createLetter(undefinedChar);
        }).toThrowError('Invalid char entered');
    });

    it('should throw error No char were given if char is empty', () => {
        expect(() => {
            letterCreator.createLetter(emptyChar);
        }).toThrowError('Invalid char entered');
    });

    it('should throw error Invalid char entered if a string is passed instead of char', () => {
        expect(() => {
            letterCreator.createLetter(str);
        }).toThrowError('Invalid char entered');
    });

    it('should throw error Invalid char entered', () => {
        expect(() => {
            letterCreator.createLetters(undefinedLongChar);
        }).toThrowError('No chars were given');
    });

    it('should throw error No char were given', () => {
        expect(() => {
            letterCreator.createLetters(emptyLongChar);
        }).toThrowError('No chars were given');
    });

    it('should throw error null char were given', () => {
        const newBlankLetter = { char: 'A', value: 0 };
        expect(letterCreator.createBlankLetter('a')).toEqual(newBlankLetter);
        expect(letterCreator.createBlankLetter('a')).not.toEqual(letterCreator.createLetter('A'));
    });

    it('should throw error null char were given', () => {
        expect(() => {
            letterCreator.createBlankLetter(emptyChar);
        }).toThrowError('Invalid char entered');
    });

    it('should create letters', () => {
        const lettersToCreate: string[] = ['A', 'B', 'C', '*'];
        const lettersToBeCreated = [];
        let newLetter: Letter;
        for (const letter of lettersToCreate) {
            let index = letter.charCodeAt(0) - ASCII_CODE;
            if (letter === '*') {
                index = LetterCreator.gameLettersValue.length - 1;
            }
            newLetter = { char: letter, value: LetterCreator.gameLettersValue[index] };
            lettersToBeCreated.push(newLetter);
        }
        const letterCreated = letterCreator.createLetters(lettersToCreate);
        expect(letterCreated).toEqual(lettersToBeCreated);
    });
});
