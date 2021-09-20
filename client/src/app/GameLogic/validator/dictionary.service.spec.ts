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
        let searchedLetters = 'zyklon';
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [new ValidWord('zyklon'), new ValidWord('zyklons')];
        result = service.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letter a', () => {
        let searchedLetters = 'a';
        let result: ValidWord[] = [];
        let expected: number = 34886;
        result = service.wordGen(searchedLetters);

        expect(result.length).toEqual(expected);
    });

    it('should return all words containing the searched letters zyk-on', () => {
        let searchedLetters = 'zyk-on';
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [new ValidWord('zyklon'), new ValidWord('zyklons')];
        result = service.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters z-k-on', () => {
        let searchedLetters = 'z-k-on';
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [new ValidWord('zyklon'), new ValidWord('zyklons')];
        result = service.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });

    it('should return all words containing the searched letters irresolutions', () => {
        let searchedLetters = 'i-----l---ons';
        let result: ValidWord[] = [];
        let expected: ValidWord[] = [
            new ValidWord('artificialisions'),
            new ValidWord('criticaillerons'),
            new ValidWord('desaisonnalisions'),
            new ValidWord('diagonalisions'),
            new ValidWord('dissimilations'),
            new ValidWord('dissimulations'),
            new ValidWord('dissimulerions'),
            new ValidWord('fristouillerons'),
            new ValidWord('helitreuillerons'),
            new ValidWord('immobilisions'),
            new ValidWord('infibulations'),
            new ValidWord('infibulerions'),
            new ValidWord('initialerions'),
            new ValidWord('initialisions'),
            new ValidWord('insufflations'),
            new ValidWord('insufflerions'),
            new ValidWord('interclassons'),
            new ValidWord('intitulerions'),
            new ValidWord('irresolutions'),
            new ValidWord('microfilmerons'),
            new ValidWord('occidentalisions'),
            new ValidWord('reinitialisions'),
            new ValidWord('spiritualisions'),
            new ValidWord('universalisions'),
            new ValidWord('zinzinulerions'),
        ];
        result = service.wordGen(searchedLetters);

        expect(result).toEqual(expected);
    });
});
