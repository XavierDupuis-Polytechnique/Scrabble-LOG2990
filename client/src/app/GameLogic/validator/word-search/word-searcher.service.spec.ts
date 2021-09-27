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
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
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
        words: ['bateau', 'butte', 'allo', 'ou', 'oui', 'nil', 'ni', 'on', 'bon', 'rat', 'bu'],
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
        this.grid[0][4].letterObject = { char: 'O', value: 1 };
        this.grid[0][5].letterObject = { char: 'N', value: 1 };
        this.grid[1][3].letterObject = { char: 'O', value: 1 };
        this.grid[0][6].letterObject = { char: 'N', value: 1 };
        // this.grid[2][3].letterObject = { char: 'N', value: 1 };
    }
}

describe('WordSearcher', () => {
    let wordSearcher: WordSearcher;
    let mockBoard: MockBoard;
    let dictionaryService: MockDictionaryService;
    let boardService: BoardService;
    let servicePoints: PointCalculatorService;
    const player: Player = new User('Max');

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockDictionaryService, BoardService, PointCalculatorService],
        });
        boardService = TestBed.inject(BoardService);
        dictionaryService = TestBed.inject(MockDictionaryService);
        servicePoints = TestBed.inject(PointCalculatorService);
        mockBoard = new MockBoard();
        boardService.board = mockBoard;
        wordSearcher = new WordSearcher(boardService, dictionaryService);
    });

    it('should be created', () => {
        expect(wordSearcher).toBeTruthy();
    });

    it('should return false if word is one letter', () => {
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'b', placement, servicePoints, wordSearcher);
        const isValid = wordSearcher.validateWords(action);
        expect(isValid).toBe(false);
    });

    it('should find coord of tile horizontally', () => {
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'oui', placement, servicePoints, wordSearcher);
        const coord = wordSearcher.findCoordOfLettersToPlace(action);
        expect(coord[0]).toEqual({ x: 4, y: 1 });
        expect(coord[1]).toEqual({ x: 5, y: 1 });
    });

    it('should find coord of tile vertically', () => {
        const placement: PlacementSetting = { x: 6, y: 0, direction: Direction.Vertical };
        const action = new PlaceLetter(player, 'non', placement, servicePoints, wordSearcher);
        const coord = wordSearcher.findCoordOfLettersToPlace(action);
        expect(coord[0]).toEqual({ x: 6, y: 1 });
        expect(coord[1]).toEqual({ x: 6, y: 2 });
    });

    it('should go to beginning of word', () => {
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'oui', placement, servicePoints, wordSearcher);
        const position: Vec2 = { x: 4, y: 1 };
        const direction = action.placement.direction as Direction;
        const beginPosition = wordSearcher.goToBeginningOfWord(direction, position);
        expect(beginPosition).toEqual({ x: 4, y: 0 });
    });

    it('should go to end of word and return the word made', () => {
        mockBoard.grid[2][5].letterObject = { char: 'L', value: 1 };
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'oui', placement, servicePoints, wordSearcher);
        const beginingPosition: Vec2 = { x: 5, y: 0 };
        const letterPosition: Vec2 = { x: 5, y: 1 };
        const word = wordSearcher.goToEndOfWord(action, beginingPosition, letterPosition);
        expect(wordSearcher.tileToString(word.letters)).toEqual('NIL');
    });

    it('should find 0 neighbour if first word ', () => {
        const placement: PlacementSetting = { x: 4, y: 0, direction: Direction.Horizontal };
        const hasNeighbour = wordSearcher.hasNeighbour({ x: placement.x, y: placement.y }, placement.direction as Direction);
        expect(hasNeighbour).toBe(false);
    });

    it('should validate word if first word ', () => {
        const placement: PlacementSetting = { x: 4, y: 0, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'on', placement, servicePoints, wordSearcher);
        const wordIsValid = wordSearcher.validateWords(action);
        expect(wordIsValid).toBe(true);
    });

    it('should find all valid words', () => {
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'oui', placement, servicePoints, wordSearcher);
        const validWords = wordSearcher.listOfValidWord(action);
        expect(wordSearcher.tileToString(validWords[0].letters)).toEqual('OUI');
        expect(wordSearcher.tileToString(validWords[1].letters)).toEqual('OU');
        expect(wordSearcher.tileToString(validWords[2].letters)).toEqual('NI');
    });

    it('should find index of letters to place for all valid words', () => {
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'oui', placement, servicePoints, wordSearcher);
        const validWords = wordSearcher.listOfValidWord(action);
        const indexFirstWord = validWords[0].index;
        const indexSecondWord = validWords[1].index;
        const indexThirdWord = validWords[2].index;
        expect(indexFirstWord[0]).toBe(1);
        expect(indexFirstWord[1]).toBe(2);
        expect(indexSecondWord[0]).toBe(1);
        expect(indexThirdWord[0]).toEqual(1);
    });

    it('should find all neighbors', () => {
        mockBoard.grid[2][2].letterObject = { char: 'U', value: 1 };
        const placement: PlacementSetting = { x: 1, y: 2, direction: Direction.Vertical };
        const action = new PlaceLetter(player, 'bateau', placement, servicePoints, wordSearcher);
        const validWord = wordSearcher.listOfValidWord(action);
        expect(wordSearcher.tileToString(validWord[0].letters)).toEqual('BATEAU');
        expect(wordSearcher.tileToString(validWord[1].letters)).toEqual('BU');
    });

    it('should return empty array if a word is invalid', () => {
        mockBoard.grid[2][2].letterObject = { char: 'O', value: 1 };
        const placement: PlacementSetting = { x: 1, y: 2, direction: Direction.Vertical };
        const action = new PlaceLetter(player, 'rat', placement, servicePoints, wordSearcher);
        const validWord = wordSearcher.listOfValidWord(action);
        expect(validWord.length).toEqual(0);
    });

    it('should return false if a word is invalid', () => {
        mockBoard.grid[2][2].letterObject = { char: 'O', value: 1 };
        const placement: PlacementSetting = { x: 1, y: 2, direction: Direction.Vertical };
        const action = new PlaceLetter(player, 'rateau', placement, servicePoints, wordSearcher);
        const isValid = wordSearcher.validateWords(action);
        expect(isValid).toBe(false);
    });
});
