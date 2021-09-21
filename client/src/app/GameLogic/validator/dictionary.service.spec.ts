import { ValidWord } from '@app/GameLogic/player/valid-word';
import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
    let service: DictionaryService = new DictionaryService();

    beforeEach(() => {
        //TestBed.configureTestingModule({});
        // service = TestBed.inject(DictionaryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return all words containing the searched letters zyklon', () => {
        let searchedLetters = new ValidWord('zyklon', 0, 0, 5, 5);
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [new ValidWord('zyklons')];
        result = service.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letter a with 3-3 board constraints', () => {
        let searchedLetters = new ValidWord('a', 0, 0, 3, 3);
        let result: ValidWord[] = [];
        let expected: number = 8925;
        result = service.wordGen(searchedLetters);

        expect(result.length).toEqual(expected);
    });

    it('should return all words containing the searched letter a with 5-5 board constraints', () => {
        let searchedLetters = new ValidWord('a', 0, 0, 5, 5);
        let result: ValidWord[] = [];
        let expected: number = 44523;
        result = service.wordGen(searchedLetters);

        expect(result.length).toEqual(expected);
    });

    it('should return all words containing the searched letters zyk-on', () => {
        let searchedLetters = new ValidWord('zyk-on', 0, 0, 0, 1);
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [new ValidWord('zyklon'), new ValidWord('zyklons')];
        result = service.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters z-k-on', () => {
        let searchedLetters = new ValidWord('z-k-on', 0, 0, 0, 1);
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [new ValidWord('zyklon'), new ValidWord('zyklons')];
        result = service.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters i-----l--ions', () => {
        let searchedLetters = new ValidWord('i-----l--ions');
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [
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
        result = service.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters allo with 1-1 board constraints', () => {
        let searchedLetters = new ValidWord('allo', 0, 0, 1, 1, false, 1);
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [
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
        result = service.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters battait with 2-0 board constraints', () => {
        let searchedLetters = new ValidWord('battait', 0, 0, 2, 0, false, 2);
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [
            new ValidWord('abattait', 0, 0, 0, 0, false, 1, 0),
            new ValidWord('debattait', 0, 0, 0, 0, false, 0, 0),
            new ValidWord('ebattait', 0, 0, 0, 0, false, 1, 0),
            new ValidWord('embattait', 0, 0, 0, 0, false, 0, 0),
            new ValidWord('rabattait', 0, 0, 0, 0, false, 0, 0),
            new ValidWord('rebattait', 0, 0, 0, 0, false, 0, 0),
        ];
        result = service.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters allo with 1-1 board constraints with the correct X Offset', () => {
        let searchedLetters = new ValidWord('allo', 0, 0, 1, 1, false, 8, 8);
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [
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
        result = service.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters allochimi with the correct Y Offset', () => {
        let searchedLetters = new ValidWord('allochimi', 0, 0, 8, 8, true, 5, 5);
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [
            new ValidWord('cristallochimie', 0, 0, 0, 0, true, 5, 0),
            new ValidWord('cristallochimies', 0, 0, 0, 0, true, 5, 0),
            new ValidWord('metallochimie', 0, 0, 0, 0, true, 5, 2),
            new ValidWord('metallochimies', 0, 0, 0, 0, true, 5, 2),
        ];
        result = service.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters tal--chimi- with the correct Y Offset', () => {
        let searchedLetters = new ValidWord('tal--chim-e', 0, 0, 8, 8, true, 5, 5);
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [
            new ValidWord('cristallochimie', 0, 0, 0, 0, true, 5, 1),
            new ValidWord('metallochimie', 0, 0, 0, 0, true, 5, 3),
            new ValidWord('metallochimies', 0, 0, 0, 0, true, 5, 3),
        ];
        result = service.wordGen(searchedLetters);
        expect(result).toEqual(expected);
    });
});
