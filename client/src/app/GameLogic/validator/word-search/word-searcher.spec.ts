import { TestBed } from '@angular/core/testing';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher';

describe('WordSearcher', () => {
    let wordSearcher: WordSearcher;

    beforeEach(() => {
        wordSearcher = TestBed.inject(WordSearcher);
    });

    it('should be created', () => {
        expect(wordSearcher).toBeTruthy();
    });
});
