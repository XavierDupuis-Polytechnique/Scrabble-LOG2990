import { TestBed } from '@angular/core/testing';
import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher';
import { Dictionary } from '../dictionary';
import { DictionaryService } from '../dictionary.service';

class mockDictionaryService extends DictionaryService {
    mockDictionary: Dictionary = { title: 'dictionnaire', description: 'mots', words: ['bateau', 'crayon', 'table', 'butte', 'allo', 'ou'] };
    constructor() {
        super();
    }

    isWordInDict(word: string): boolean {
        const dict = new Set(this.mockDictionary.words);
        return dict.has(word.toLowerCase());
    }
}

class mockBoard {
    grid: Tile[][];
    constructor() {
        this.grid = [];
        for (let i = 0; i < 5; i++) {
            this.grid[i] = [];
            for (let j = 0; j < 5; j++) {
                this.grid[i][j] = new Tile();
                this.grid[i][j].letterObject = { char: ' ', value: 1 };
            }
        }

        this.grid[0][0].letterObject = { char: 'A', value: 1 };
        this.grid[0][1].letterObject = { char: 'L', value: 1 };
        this.grid[0][2].letterObject = { char: 'L', value: 1 };
        this.grid[0][3].letterObject = { char: 'O', value: 1 };
        this.grid[1][3].letterObject = { char: 'U', value: 1 };
    }
}

describe('WordSearcher', () => {
    let wordSearcher: WordSearcher;
    let board: mockBoard = new mockBoard();
    let dictionaryService: mockDictionaryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [mockDictionaryService, mockBoard],
        });
        dictionaryService = TestBed.inject(mockDictionaryService);
        wordSearcher = new WordSearcher(board, dictionaryService);
    });

    it('should be created', () => {
        expect(wordSearcher).toBeTruthy();
    });

    it('should thorw error if word is not valid', () => {
        const word: Tile[] = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        expect(() => {
            wordSearcher.addWord(word);
        }).toThrow();
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
        const word: Tile[] = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];

        wordSearcher.addWord(word);
        expect(wordSearcher.listOfValidWord).toContain('butte');
    });

    it('should find all neighbours if they are all valid words', () => {
        const player: Player = new User('Max');
        const letters: Letter[] = [{ char: 'U', value: 1 }];
        const place: PlacementSetting = { x: 3, y: 1, direction: 'V' };

        const action = new PlaceLetter(player, letters, place);

        // wordSearcher.grid[1][3].letterObject = { char: 'U', value: 1 };
        // let word = wordSearcher.getWordHorizontal(0, 0);

        wordSearcher.searchAdjacentWords(action);
        console.log('Word Validator:', wordSearcher.listOfValidWord);
        expect(wordSearcher.listOfValidWord).toContain('ou');
    });

    // it('should add word to list if word is valid on board', () => {
    //     //Mot allo a la poisition (0,0) on ajoute u(4,0);
    //     const player: Player = new User('Max');
    //     const letters: Letter[] = [{ char: 'U', value: 1 }];
    //     const place: PlacementSetting = { x: 3, y: 1, direction: 'H' };

    //     const action = new PlaceLetter(player, letters, place);

    //     wordSearcher.validatePlacement(action);
    //     expect(wordSearcher.listOfValidWord).toContain('ou'); //Et regarder pour allo
    // });
});
