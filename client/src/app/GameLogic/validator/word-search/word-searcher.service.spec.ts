/* eslint max-classes-per-file: ["error", 2] */
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { Board } from '@app/GameLogic/game/board';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { Dictionary } from '@app/GameLogic/validator/dictionary';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { BoardService } from '@app/services/board.service';

const BOARD_LENGTH = 10;
const BOARD_WIDTH = 10;
class MockDictionaryService extends DictionaryService {
    @Injectable()
    mockDictionary: Dictionary = {
        title: 'dictionnaire',
        description: 'mots',
        words: ['bateau', 'butte', 'allo', 'ou', 'oui', 'nil', 'ni', 'on', 'bon'],
    };

    isWordInDict(word: string): boolean {
        const dict = new Set(this.mockDictionary.words);
        return dict.has(word);
    }
}

class MockBoard extends Board {
    grid: Tile[][];
    constructor() {
        super();
        this.grid = [];
        for (let i = 0; i < BOARD_WIDTH; i++) {
            this.grid[i] = [];
            for (let j = 0; j < BOARD_LENGTH; j++) {
                this.grid[i][j] = new Tile();
                this.grid[i][j].letterObject = { char: ' ', value: 1 };
            }
        }

        // this.grid[0][0].letterObject = { char: 'M', value: 1 };
        // this.grid[0][1].letterObject = { char: 'I', value: 1 };
        // this.grid[0][0].letterObject = { char: 'A', value: 1 };
        // this.grid[0][1].letterObject = { char: 'L', value: 1 };
        this.grid[0][4].letterObject = { char: 'O', value: 1 };
        this.grid[0][5].letterObject = { char: 'N', value: 1 };

        this.grid[1][3].letterObject = { char: 'O', value: 1 };

        this.grid[2][3].letterObject = { char: 'N', value: 1 };

        // this.grid[4][1].letterObject = { char: 'E', value: 1 };
        // this.grid[4][2].letterObject = { char: 'L', value: 1 };
        // this.grid[4][3].letterObject = { char: 'L', value: 1 };
        // this.grid[4][4].letterObject = { char: 'E', value: 1 };
    }
}

describe('WordSearcher', () => {
    let wordSearcher: WordSearcher;
    let mockBoard: MockBoard;
    let dictionaryService: MockDictionaryService;
    let boardService: BoardService;

    const player: Player = new User('Max');

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockDictionaryService, BoardService],
        });
        boardService = TestBed.inject(BoardService);
        dictionaryService = TestBed.inject(MockDictionaryService);
        mockBoard = new MockBoard();
        boardService.board = mockBoard;
        wordSearcher = new WordSearcher(boardService, dictionaryService);
    });

    it('should be created', () => {
        expect(wordSearcher).toBeTruthy();
    });

    it('should find coord of tile ', () => {
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'oui', placement);
        const coord = wordSearcher.findCoordOfLettersToPLace(action);

        expect(coord[0]).toEqual({ x: 4, y: 1 });
        expect(coord[1]).toEqual({ x: 5, y: 1 });
    });

    it('should go to beginning of word', () => {
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'oui', placement);
        const position: Vec2 = { x: 4, y: 1 };
        const direction = action.placement.direction as Direction;
        const beginPosition = wordSearcher.goToBeginningOfWord(direction, position);
        expect(beginPosition).toEqual({ x: 4, y: 0 });
    });

    it('should go to end of word and return the word made', () => {
        // Nil
        mockBoard.grid[2][5].letterObject = { char: 'L', value: 1 };
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'oui', placement);
        const beginingPosition: Vec2 = { x: 5, y: 0 };
        const letterPosition: Vec2 = { x: 5, y: 1 };
        const endLetter = wordSearcher.goToEndOfWord(action, beginingPosition, letterPosition);
        expect(wordSearcher.tileToString(endLetter)).toEqual('NIL');
    });

    it('should find 0 neighbour if first word ', () => {
        const placement: PlacementSetting = { x: 4, y: 0, direction: Direction.Horizontal };
        const hasNeighbour = wordSearcher.hasNeighbour({ x: placement.x, y: placement.y }, placement.direction as Direction);
        expect(hasNeighbour).toBe(false);
    });

    it('should validate word if first word ', () => {
        const placement: PlacementSetting = { x: 4, y: 0, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'on', placement);
        const wordIsValid = wordSearcher.validateWords(action);
        expect(wordIsValid).toBe(true);
    });

    it('should find all valid words', () => {
        // On ajoute le mot oui a la poisition (3,1) on a u(1,3);

        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'oui', placement);
        const validWord = wordSearcher.listOfValidWord(action);
        expect(wordSearcher.tileToString(validWord[0])).toEqual('OUI');
        expect(wordSearcher.tileToString(validWord[1])).toEqual('OU');
        expect(wordSearcher.tileToString(validWord[2])).toEqual('NI');
    });
    it('should find all neighbors', () => {
        // On ajoute le mot oui a la poisition (3,1) on a u(1,3);
        mockBoard.grid[2][2].letterObject = { char: 'O', value: 1 };
        const placement: PlacementSetting = { x: 1, y: 2, direction: Direction.Vertical };
        const action = new PlaceLetter(player, 'bateau', placement);
        const validWord = wordSearcher.listOfValidWord(action);
        expect(wordSearcher.tileToString(validWord[0])).toEqual('BATEAU');
        expect(wordSearcher.tileToString(validWord[1])).toEqual('BON');
    });
});
