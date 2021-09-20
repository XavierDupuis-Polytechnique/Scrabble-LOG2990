/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { Tile } from '@app/GameLogic/game/tile';
import { Dictionary } from '../dictionary';
import { DictionaryService } from '../dictionary.service';
import { WordValidatorService } from './word-validator.service';
class mockDictionaryService extends DictionaryService {
    mockDictionary: Dictionary = { title: 'dictionnaire', description: 'mots', words: ['bateau', 'crayon', 'table'] };
    constructor() {
        super();
    }

    isWordInDict(word: string): boolean {
        const dict = new Set(this.mockDictionary.words);
        // this.mockDictionary.words.forEach((word) => {
        //     dict.add(word);
        // });
        return dict.has(word.toLowerCase());
    }
}

describe('Service: WordValidator', () => {
    let dictionaryService = new mockDictionaryService();
    let wordValidator = new WordValidatorService(dictionaryService);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WordValidatorService, mockDictionaryService],
        });
        wordValidator = TestBed.inject(WordValidatorService);
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
        expect(wordBateauToString).toBe('BATEAU');
    });

    it('should return true if word is in dictionary', () => {
        let wordBateau: Tile[];
        wordBateau = [
            { letterObject: { char: 'b', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'a', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 't', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'e', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'a', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'u', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        expect(wordValidator.isAWord(wordBateau)).toBeTruthy();
    });
});
