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
    mockDictionary: Dictionary = { title: 'dictionnaire', description: 'mots', words: ['bateau', 'crayon', 'table','butte'] };
    constructor() {
        super();
    }

    isWordInDict(word: string): boolean {
        const dict = new Set(this.mockDictionary.words);
        return dict.has(word.toLowerCase());
    }
}

class mockBoard extends Board {
    
    constructor(){
        super()
    }
    addword(letters: Letter[], place:PlacementSetting){
            let x = place.x;
            let y =place.y;
            const direction = place.direction;
            const startTile = this.grid[x][y];
            let currentTile = startTile;
            let currentLetterIndex = 0;
            while (currentLetterIndex < letters.length) {
                if (currentTile.letterObject == null || currentTile.letterObject.char === ' ') {
                    currentTile.letterObject = letters[currentLetterIndex++];
                }
                currentTile = this.isDirectionVertical(direction) ? this.grid[x][y++] : this.grid[x++][y];
            }
        }
    
        private isDirectionVertical(direction: string): boolean {
            return direction.charAt(0).toLowerCase() === 'v';
        }
}

describe('WordSearcher', () => {
    let wordSearcher: WordSearcher;
    let board: mockBoard = new mockBoard();
    let dictionaryService:mockDictionaryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:[mockDictionaryService, mockBoard]
        });
        dictionaryService = TestBed.inject(mockDictionaryService);
        wordSearcher = new WordSearcher(board, dictionaryService);
        const wordAllo:Letter[] = [
            { char: 'A', value: 1 },
            { char: 'L', value: 1 },
            { char: 'L', value: 1 },
            { char: '0', value: 1 },
        ]
        const place:PlacementSetting = {x:0,y:0,direction:'H'};
        board.addword(wordAllo,place);
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

    it('should add word to list if word is valid on board', () => {
        //Mot allo a la poisition (0,0) on ajout u(4,0);
        const player: Player = new User('Max');
        const letters:Letter[] = [
            { char: 'U', value: 1 }
        ];
        const place:PlacementSetting = {x:4,y:1,direction:'H'};

        const action = new PlaceLetter(player,letters,place);
        wordSearcher.validatePlacement(action);
        expect(wordSearcher.listOfValidWord).toContain('ou'); //Et regarder pour allo
    });
});
