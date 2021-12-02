import { LetterCreator } from '@app/game/game-logic/board/letter-creator';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { ASCII_CODE } from '@app/game/game-logic/constants';
import { expect } from 'chai';

describe('LetterCreator', () => {
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
        expect(letterCreator).to.be.instanceof(LetterCreator);
    });

    it('should throw error No char were given if char is undefined', () => {
        expect(() => {
            letterCreator.createLetter(undefinedChar);
        }).to.throw('Invalid char entered');
    });

    it('should throw error No char were given if char is empty', () => {
        expect(() => {
            letterCreator.createLetter(emptyChar);
        }).to.throw('Invalid char entered');
    });

    it('should throw error Invalid char entered if a string is passed instead of char', () => {
        expect(() => {
            letterCreator.createLetter(str);
        }).to.throw('Invalid char entered');
    });

    it('should throw error Invalid char entered', () => {
        expect(() => {
            letterCreator.createLetters(undefinedLongChar);
        }).to.throw('No chars were given');
    });

    it('should throw error No char were given', () => {
        expect(() => {
            letterCreator.createLetters(emptyLongChar);
        }).to.throw('No chars were given');
    });

    it('should properly create a blank letter from char', () => {
        const newBlankLetter = { char: 'A', value: 0 };
        expect(letterCreator.createBlankLetter('a')).to.be.deep.equal(newBlankLetter);
        expect(letterCreator.createBlankLetter('a')).not.to.be.deep.equal(letterCreator.createLetter('A'));
    });

    it('should throw error null char were given', () => {
        expect(() => {
            letterCreator.createBlankLetter(emptyChar);
        }).to.throw('Invalid char entered');
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
        expect(letterCreated).to.be.deep.equal(lettersToBeCreated);
    });
});
