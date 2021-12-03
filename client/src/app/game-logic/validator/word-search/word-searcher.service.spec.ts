/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { Direction } from '@app/game-logic/direction.enum';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { MockBoard } from '@app/game-logic/validator/word-search/mocks/mock-board';
import { MockDictionaryService } from '@app/game-logic/validator/word-search/mocks/mock-dictionary-service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';

describe('WordSearcher', () => {
    let wordSearcher: WordSearcher;
    let mockBoard: MockBoard;
    let boardService: BoardService;
    let pointCalculator: PointCalculatorService;
    const dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['getDictionary']);
    const mockDict = new MockDictionaryService(dictHttpServiceMock);
    let player: Player;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: mockDict }],
        });
        player = new User('Max');
        boardService = TestBed.inject(BoardService);
        mockBoard = new MockBoard();
        boardService.board = mockBoard;
        pointCalculator = TestBed.inject(PointCalculatorService);
        wordSearcher = TestBed.inject(WordSearcher);
    });

    it('should be created', () => {
        expect(wordSearcher).toBeTruthy();
    });

    it('should return false if word is one letter', () => {
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const coord = wordSearcher['findCoordOfLettersToPlace']('oui', placement);
        expect(coord[0]).toEqual({ x: 4, y: 1 });
        expect(coord[1]).toEqual({ x: 5, y: 1 });
    });

    it('should find coord of tile vertically', () => {
        const placement: PlacementSetting = { x: 6, y: 0, direction: Direction.Vertical };
        const coord = wordSearcher['findCoordOfLettersToPlace']('non', placement);
        expect(coord[0]).toEqual({ x: 6, y: 1 });
        expect(coord[1]).toEqual({ x: 6, y: 2 });
    });

    it('should find 0 neighbour if first word ', () => {
        const placement: PlacementSetting = { x: 4, y: 0, direction: Direction.Horizontal };
        const perpDirection: Direction = Direction.Vertical;
        const hasNeighbour = wordSearcher['hasNeighbour'](placement.x, placement.y, perpDirection);
        expect(hasNeighbour).toBe(false);
    });

    it('should validate word if first word ', () => {
        const placement: PlacementSetting = { x: 4, y: 0, direction: Direction.Horizontal };
        const action = new PlaceLetter(player, 'on', placement, pointCalculator, wordSearcher);
        const wordIsValid = wordSearcher.isWordValid(action);
        expect(wordIsValid).toBe(true);
    });

    it('should find all valid words', () => {
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const validWords = wordSearcher.listOfValidWord({ word: 'oui', placement });
        expect(wordSearcher['tileToString'](validWords[0].letters)).toEqual('OUI');
        expect(wordSearcher['tileToString'](validWords[1].letters)).toEqual('OU');
        expect(wordSearcher['tileToString'](validWords[2].letters)).toEqual('NI');
    });

    it('should find index of letters to place for all valid words', () => {
        const placement: PlacementSetting = { x: 3, y: 1, direction: Direction.Horizontal };
        const validWords = wordSearcher.listOfValidWord({ word: 'oui', placement });
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
        const validWord = wordSearcher.listOfValidWord({ word: 'bateau', placement });
        expect(wordSearcher['tileToString'](validWord[0].letters)).toEqual('BATEAU');
        expect(wordSearcher['tileToString'](validWord[1].letters)).toEqual('BU');
    });

    it('should return empty array if a word is invalid', () => {
        mockBoard.grid[2][2].letterObject = { char: 'O', value: 1 };
        const placement: PlacementSetting = { x: 1, y: 2, direction: Direction.Vertical };
        const validWord = wordSearcher.listOfValidWord({ word: 'rateau', placement });
        expect(validWord.length).toEqual(0);
    });

    it('should return false if a word is invalid', () => {
        mockBoard.grid[2][2].letterObject = { char: 'O', value: 1 };
        const placement: PlacementSetting = { x: 1, y: 2, direction: Direction.Vertical };
        const action = new PlaceLetter(player, 'rateau', placement, pointCalculator, wordSearcher);
        const isValid = wordSearcher.isWordValid(action);
        expect(isValid).toBe(false);
    });
    it('should return true even if word has blank letter', () => {
        mockBoard.grid[2][2].letterObject = { char: 'N', value: 1 };
        const placement: PlacementSetting = { x: 1, y: 2, direction: Direction.Vertical };
        const action = new PlaceLetter(player, 'On', placement, pointCalculator, wordSearcher);
        const isValid = wordSearcher.isWordValid(action);
        expect(isValid).toBe(true);
    });
});
