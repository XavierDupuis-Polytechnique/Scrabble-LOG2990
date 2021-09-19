/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { DictionaryService } from '../dictionary.service';
import { WordValidatorService } from './word-validator.service';

describe('Service: WordValidator', () => {
    let dictionnary = new DictionaryService();
    let wordValidator = new WordValidatorService(dictionnary);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WordValidatorService],
        });
    });

    it('should be created', () => {
        expect(wordValidator).toBeTruthy();
    });

    it('should convert a word in tile to string', () => {
        const wordBateau = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        const wordBateauToString = wordValidator.tileToString(wordBateau);
        expect(wordBateauToString).toBeInstanceOf(String);
    });
});
