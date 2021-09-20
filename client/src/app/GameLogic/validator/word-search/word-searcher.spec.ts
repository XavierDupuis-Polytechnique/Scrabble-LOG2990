import { TestBed } from '@angular/core/testing';
import { Board } from '@app/GameLogic/game/board';
import { Tile } from '@app/GameLogic/game/tile';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher';
import { Dictionary } from '../dictionary';
import { DictionaryService } from '../dictionary.service';

class mockDictionaryService extends DictionaryService {
    mockDictionary: Dictionary = { title: 'dictionnaire', description: 'mots', words: ['bateau', 'crayon', 'table','butte'] };
    constructor() {
        super();
    }

    isWordInDict(word: string): boolean {
        const dict = new Set(this.mockDictionary.words);
        return dict.has(word.toLowerCase());
    }
}
describe('WordSearcher', () => {
    let wordSearcher: WordSearcher;
    const board: Board = new Board();
    let dictionaryService:mockDictionaryService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:[mockDictionaryService]
        });
        dictionaryService = TestBed.inject(mockDictionaryService);
        wordSearcher = new WordSearcher(board, dictionaryService);

       
    });

    it('should be created', () => {
        expect(wordSearcher).toBeTruthy();
    });

    it('should thorw error if word is not valid', () => {
        const word:Tile[] = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        expect(()=>{wordSearcher.addWord(word)}).toThrow();
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
        const wordBateauToString = wordSearcher.tileToString(wordBateau);
        expect(wordBateauToString).toBeInstanceOf(String);
        expect(wordBateauToString).toBe('BATEAU');
    });

    it('should add word to list if word is valid', () => {
        const word:Tile[] = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        
        wordSearcher.addWord(word);
        expect(wordSearcher.listOfValidWord).toContain('butte');
    });
});
