/* eslint-disable @typescript-eslint/no-magic-numbers*/
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';


describe('DictionaryService', () => {
    let dictionaryService: DictionaryService; // = new DictionaryService();
    // service = new DictionaryService();

    beforeEach(() => {
        // TestBed.configureTestingModule({
        //     providers: [DictionaryService]
        // });
        // dictionaryService = TestBed.inject(DictionaryService)
        // TestBed.configureTestingModule({});
        // service = TestBed.inject(DictionaryService);
        dictionaryService = new DictionaryService();
    });

    it('should be created', () => {
        expect(dictionaryService).toBeTruthy();
    });

    it('should return true if word is in dictionary', () => {
        expect(dictionaryService.isWordInDict('Bateau')).toBeTrue();
    });

    it('should return all words containing the searched letters zyklon', () => {
        const searchedLetters = new ValidWord('zyklon', 0, 0, 5, 5);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [new ValidWord('zyklons')];
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
        const expected: ValidWord[] = [new ValidWord('zyklon'), new ValidWord('zyklons')];
        result = dictionaryService.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters z-k-on', () => {
        const searchedLetters = new ValidWord('z-k-on', 0, 0, 0, 1);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [new ValidWord('zyklon'), new ValidWord('zyklons')];
        result = dictionaryService.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters i-----l--ions', () => {
        const searchedLetters = new ValidWord('i-----l--ions');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('immobilisions'),
            new ValidWord('infibulations'),
            new ValidWord('infibulerions'),
            new ValidWord('initialerions'),
            new ValidWord('initialisions'),
            new ValidWord('insufflations'),
            new ValidWord('insufflerions'),
            new ValidWord('intitulerions'),
            new ValidWord('irresolutions'),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters allo with 1-1 board constraints', () => {
        const searchedLetters = new ValidWord('allo', 0, 0, 1, 1, false, 1);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('alloc', 0, 0, 0, 0, false, 1, 0),
            new ValidWord('ballon'),
            new ValidWord('ballot'),
            new ValidWord('gallo'),
            new ValidWord('gallon'),
            new ValidWord('gallos'),
            new ValidWord('gallot'),
            new ValidWord('vallon'),
            new ValidWord('wallon'),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters battait with 2-0 board constraints', () => {
        const searchedLetters = new ValidWord('battait', 0, 0, 2, 0, false, 2);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('abattait', 0, 0, 0, 0, false, 1, 0),
            new ValidWord('debattait', 0, 0, 0, 0, false, 0, 0),
            new ValidWord('ebattait', 0, 0, 0, 0, false, 1, 0),
            new ValidWord('embattait', 0, 0, 0, 0, false, 0, 0),
            new ValidWord('rabattait', 0, 0, 0, 0, false, 0, 0),
            new ValidWord('rebattait', 0, 0, 0, 0, false, 0, 0),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters allo with 1-1 board constraints with the correct X Offset', () => {
        const searchedLetters = new ValidWord('allo', 0, 0, 1, 1, false, 8, 8);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('alloc', 0, 0, 0, 0, false, 8, 8),
            new ValidWord('ballon', 0, 0, 0, 0, false, 7, 8),
            new ValidWord('ballot', 0, 0, 0, 0, false, 7, 8),
            new ValidWord('gallo', 0, 0, 0, 0, false, 7, 8),
            new ValidWord('gallon', 0, 0, 0, 0, false, 7, 8),
            new ValidWord('gallos', 0, 0, 0, 0, false, 7, 8),
            new ValidWord('gallot', 0, 0, 0, 0, false, 7, 8),
            new ValidWord('vallon', 0, 0, 0, 0, false, 7, 8),
            new ValidWord('wallon', 0, 0, 0, 0, false, 7, 8),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters allochimi with the correct Y Offset', () => {
        const searchedLetters = new ValidWord('allochimi', 0, 0, 8, 8, true, 5, 5);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('cristallochimie', 0, 0, 0, 0, true, 5, 0),
            new ValidWord('cristallochimies', 0, 0, 0, 0, true, 5, 0),
            new ValidWord('metallochimie', 0, 0, 0, 0, true, 5, 2),
            new ValidWord('metallochimies', 0, 0, 0, 0, true, 5, 2),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters tal--chimi- with the correct Y Offset', () => {
        const searchedLetters = new ValidWord('tal--chim-e', 0, 0, 8, 8, true, 5, 5);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [
            new ValidWord('cristallochimie', 0, 0, 0, 0, true, 5, 1),
            new ValidWord('metallochimie', 0, 0, 0, 0, true, 5, 3),
            new ValidWord('metallochimies', 0, 0, 0, 0, true, 5, 3),
        ];
        result = dictionaryService.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });
});
