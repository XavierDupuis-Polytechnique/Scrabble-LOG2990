import { TestBed } from '@angular/core/testing';
import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { Board } from '@app/GameLogic/game/board';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher';
import { Dictionary } from '../dictionary';
import { DictionaryService } from '../dictionary.service';

class mockDictionaryService extends DictionaryService {
    mockDictionary: Dictionary = { title: 'dictionnaire', description: 'mots', words: ['bateau', 'crayon', 'table', 'butte'] };
    constructor() {
        super();
    }

    isWordInDict(word: string): boolean {
        const dict = new Set(this.mockDictionary.words);
        return dict.has(word.toLowerCase());
    }
}

class mockBoard extends Board {
    grid: Tile[][];
    constructor() {
        super();

        this.grid = [];
        for (let i = 0; i < 15; i++) {
            this.grid[i] = [];
            for (let j = 0; j < 15; j++) {
                this.grid[i][j] = new Tile();
                this.grid[i][j].letterObject = { char: ' ', value: 1 };
            }
        }
    }
    addWordToBoard(letters: Tile[], place: PlacementSetting) {
        let x = place.x;
        let y = place.y;
        const direction = place.direction;
        const startTile = this.grid[y][x];
        let currentTile = startTile;
        let currentLetterIndex = 0;
        while (currentLetterIndex < letters.length) {
            if (typeof (currentTile.letterObject === undefined)) {
                return;
            }
            if (currentTile.letterObject === { char: ' ', value: 1 }) {
                //Undefined
                currentTile.letterObject = letters[currentLetterIndex++].letterObject;
            }
            currentTile = this.isDirectionVertical(direction) ? this.grid[y++][x] : this.grid[y][x++];
        }
    }

    private isDirectionVertical(direction: string): boolean {
        return direction.charAt(0).toLowerCase() === 'v';
    }
}

describe('WordSearcher', () => {
    let wordSearcher: WordSearcher;
    let board: mockBoard = new mockBoard();
    // let dictionaryService: mockDictionaryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [mockDictionaryService, mockBoard],
        });
        // dictionaryService = TestBed.inject(mockDictionaryService);
        wordSearcher = new WordSearcher(board /*, dictionaryService*/);
        const wordAllo: Tile[] = [
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'L', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'L', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        const place: PlacementSetting = { x: 0, y: 0, direction: 'H' };
        board.addWordToBoard(wordAllo, place);
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
        const place: PlacementSetting = { x: 3, y: 1, direction: 'H' };

        const action = new PlaceLetter(player, letters, place);
        const tile: Tile[] = [{ letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 }];
        board.addWordToBoard(tile, place);
        wordSearcher.searchAdjacentWords(action);
        console.log('Word Validator:', wordSearcher.listOfValidWord[0]);
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
