/* eslint-disable dot-notation */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers*/
import { DEFAULT_DICTIONARY_TITLE } from '@app/game-logic/constants';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { ValidWord } from '@app/game-logic/player/bot/valid-word';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { of } from 'rxjs';

describe('DictionaryService', () => {
    const dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['getDict']);
    dictHttpServiceMock.getDict.and.returnValue(of({ title: 'testTitle', description: 'testDesc', words: ['aa', 'bb', 'cc'] }));
    const dictionaryService = new DictionaryService(dictHttpServiceMock);

    beforeEach(() => {
        if (!dictionaryService.isDefaultDict) {
            dictionaryService['addDefault']();
        }
    });

    it('should be created', () => {
        expect(dictionaryService).toBeTruthy();
    });

    it('should load the default dict if not loaded already', () => {
        dictionaryService.isDefaultDict = false;
        dictionaryService.fetchDictionary(DEFAULT_DICTIONARY_TITLE);
        expect(dictionaryService.isDefaultDict).toBeTruthy();
    });

    it('should fetch the dict if its not the default', () => {
        dictionaryService.fetchDictionary('testTitle');
        expect(dictionaryService.isWordInDict('cc')).toBeTruthy();
    });

    it('should return true if word is in dictionary', () => {
        expect(dictionaryService.isWordInDict('Bateau')).toBeTrue();
    });

    it('should return all words containing the searched letters a with a 0-0 board constraints ', () => {
        const searchedLetters = new ValidWord('a', 0, 0, 0, 0);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];
        result = dictionaryService.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters zyklon', () => {
        const searchedLetters = new ValidWord('zyklon', 0, 0, 5, 5);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [new ValidWord('zyklons', 0, 0, 0, 0, false, 0, 0, 1)];
        result = dictionaryService.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letter a with 3-3 board constraints', () => {
        const searchedLetters = new ValidWord('a', 0, 0, 3, 3);
        let result: ValidWord[] = [];
        const expected = 8925;
        result = dictionaryService.wordGen(searchedLetters);

        expect(result.length).toEqual(expected);
    });

    it('should return all words containing the searched letter a with 5-5 board constraints', () => {
        const searchedLetters = new ValidWord('a', 0, 0, 5, 5);
        let result: ValidWord[] = [];
        const expected = 44523;
        result = dictionaryService.wordGen(searchedLetters);

        expect(result.length).toEqual(expected);
    });

    it('should return all words containing the searched letters zyk-on', () => {
        const searchedLetters = new ValidWord('zyk-on', 0, 0, 0, 1);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [new ValidWord('zyklon', 0, 0, 0, 0, false, 0, 0, 1), new ValidWord('zyklons', 0, 0, 0, 0, false, 0, 0, 2)];
        result = dictionaryService.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters z-k-on', () => {
        const searchedLetters = new ValidWord('z-k-on', 0, 0, 0, 1);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [new ValidWord('zyklon', 0, 0, 0, 0, false, 0, 0, 2), new ValidWord('zyklons', 0, 0, 0, 0, false, 0, 0, 3)];
        result = dictionaryService.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters i-----l--ions', () => {
        const searchedLetters = new ValidWord('i-----l--ions');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('immobilisions', 0, 0, 0, 0, false, 0, 0, 7),
            new ValidWord('infibulations', 0, 0, 0, 0, false, 0, 0, 7),
            new ValidWord('infibulerions', 0, 0, 0, 0, false, 0, 0, 7),
            new ValidWord('initialerions', 0, 0, 0, 0, false, 0, 0, 7),
            new ValidWord('initialisions', 0, 0, 0, 0, false, 0, 0, 7),
            new ValidWord('insufflations', 0, 0, 0, 0, false, 0, 0, 7),
            new ValidWord('insufflerions', 0, 0, 0, 0, false, 0, 0, 7),
            new ValidWord('intitulerions', 0, 0, 0, 0, false, 0, 0, 7),
            new ValidWord('irresolutions', 0, 0, 0, 0, false, 0, 0, 7),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters allo with 1-1 board constraints', () => {
        const searchedLetters = new ValidWord('allo', 0, 0, 1, 1, false, 1);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('alloc', 0, 0, 0, 0, false, 1, 0, 1),
            new ValidWord('ballon', 0, 0, 0, 0, false, 0, 0, 2),
            new ValidWord('ballot', 0, 0, 0, 0, false, 0, 0, 2),
            new ValidWord('gallo', 0, 0, 0, 0, false, 0, 0, 1),
            new ValidWord('gallon', 0, 0, 0, 0, false, 0, 0, 2),
            new ValidWord('gallos', 0, 0, 0, 0, false, 0, 0, 2),
            new ValidWord('gallot', 0, 0, 0, 0, false, 0, 0, 2),
            new ValidWord('vallon', 0, 0, 0, 0, false, 0, 0, 2),
            new ValidWord('wallon', 0, 0, 0, 0, false, 0, 0, 2),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters battait with 2-0 board constraints', () => {
        const searchedLetters = new ValidWord('battait', 0, 0, 2, 0, false, 2);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('abattait', 0, 0, 0, 0, false, 1, 0, 1),
            new ValidWord('debattait', 0, 0, 0, 0, false, 0, 0, 2),
            new ValidWord('ebattait', 0, 0, 0, 0, false, 1, 0, 1),
            new ValidWord('embattait', 0, 0, 0, 0, false, 0, 0, 2),
            new ValidWord('rabattait', 0, 0, 0, 0, false, 0, 0, 2),
            new ValidWord('rebattait', 0, 0, 0, 0, false, 0, 0, 2),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters allo with 1-1 board constraints with the correct X Offset', () => {
        const searchedLetters = new ValidWord('allo', 0, 0, 1, 1, false, 8, 8);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('alloc', 0, 0, 0, 0, false, 8, 8, 1),
            new ValidWord('ballon', 0, 0, 0, 0, false, 7, 8, 2),
            new ValidWord('ballot', 0, 0, 0, 0, false, 7, 8, 2),
            new ValidWord('gallo', 0, 0, 0, 0, false, 7, 8, 1),
            new ValidWord('gallon', 0, 0, 0, 0, false, 7, 8, 2),
            new ValidWord('gallos', 0, 0, 0, 0, false, 7, 8, 2),
            new ValidWord('gallot', 0, 0, 0, 0, false, 7, 8, 2),
            new ValidWord('vallon', 0, 0, 0, 0, false, 7, 8, 2),
            new ValidWord('wallon', 0, 0, 0, 0, false, 7, 8, 2),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters allochimi with the correct Y Offset', () => {
        const searchedLetters = new ValidWord('allochimi', 0, 0, 5, 5, true, 5, 5);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('cristallochimie', 0, 0, 0, 0, true, 5, 0, 6),
            new ValidWord('metallochimie', 0, 0, 0, 0, true, 5, 2, 4),
            new ValidWord('metallochimies', 0, 0, 0, 0, true, 5, 2, 5),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters tal--chimi- with the correct Y Offset', () => {
        const searchedLetters = new ValidWord('tal--chim-e', 0, 0, 8, 8, true, 5, 5);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('cristallochimie', 0, 0, 0, 0, true, 5, 1, 7),
            new ValidWord('metallochimie', 0, 0, 0, 0, true, 5, 3, 5),
            new ValidWord('metallochimies', 0, 0, 0, 0, true, 5, 3, 6),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (simple true)', () => {
        const testLine = 'oa';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'Y', value: 1 },
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
            { char: 'Z', value: 1 },
        ];
        const expected = 'keyboard';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (simple false)', () => {
        const testLine = 'oa';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
            { char: 'Z', value: 1 },
            { char: 'X', value: 1 },
        ];
        const expected = 'false';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex true)', () => {
        const testLine = 'y--a';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'O', value: 1 },
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
            { char: 'Z', value: 1 },
        ];
        const expected = 'keyboard';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex false)', () => {
        const testLine = 'y--a';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'O', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
            { char: 'Z', value: 1 },
            { char: 'X', value: 1 },
        ];
        const expected = 'false';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word attendant with the available letters (complex double letters true)', () => {
        const testLine = 't--n--n';
        const testWord = new ValidWord('attendant');
        const letters: Letter[] = [
            { char: 'T', value: 1 },
            { char: 'T', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: '*', value: 1 },
            { char: 'D', value: 1 },
            { char: 'Z', value: 1 },
        ];
        const expected = 'attEndant';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (complex false)', () => {
        const testLine = 'y--a--s';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
            { char: 'Z', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
            { char: 'X', value: 1 },
        ];
        const expected = 'false';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word keyboard with the available letters (double letters false)', () => {
        const testLine = 'y--a--s';
        const testWord = new ValidWord('keyboard');
        const letters: Letter[] = [
            { char: 'O', value: 1 },
            { char: 'O', value: 1 },
            { char: 'E', value: 1 },
            { char: 'B', value: 1 },
            { char: 'R', value: 1 },
            { char: 'K', value: 1 },
        ];
        const expected = 'false';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word houssiner with the available letters ("*" true)', () => {
        const testLine = 'u-si--r';
        const testWord = new ValidWord('houssiner');
        const letters: Letter[] = [
            { char: 'S', value: 1 },
            { char: '*', value: 1 },
            { char: 'O', value: 1 },
            { char: 'N', value: 1 },
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'R', value: 1 },
        ];
        const expected = 'Houssiner';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word skippassent with the available letters (double letter true)', () => {
        const testLine = 'ki--as--tn';
        const testWord = new ValidWord('skippassent');
        const letters: Letter[] = [
            { char: 'S', value: 1 },
            { char: 'P', value: 1 },
            { char: 'P', value: 1 },
            { char: 'S', value: 1 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'Z', value: 1 },
        ];
        const expected = 'false';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word ecolier with the available letters (edge case bug fixing test)', () => {
        const testLine = 'e';
        const testWord = new ValidWord('ecolier');
        const letters: Letter[] = [
            { char: 'L', value: 1 },
            { char: 'J', value: 1 },
            { char: 'R', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'E', value: 1 },
            { char: 'S', value: 1 },
        ];
        const expected = 'false';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word eteTa with the available letters (edge case 2 bug fixing test)', () => {
        const testLine = 'e';
        const testWord = new ValidWord('eteta');
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'X', value: 1 },
            { char: 'P', value: 1 },
            { char: 'T', value: 1 },
            { char: 'A', value: 1 },
            { char: '*', value: 1 },
            { char: 'V', value: 1 },
        ];
        const expected = 'false';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });

    it('should check if its possible to form the word eteTa with the available letters (edge case 3 bug fixing test)', () => {
        const testLine = 'x';
        const testWord = new ValidWord('kleenex');
        const letters: Letter[] = [
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        const expected = 'false';

        const result: string = dictionaryService.regexValidation(testWord, testLine, letters);
        expect(result).toEqual(expected);
    });
});
