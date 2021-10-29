/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import {
    BACKSPACE,
    BOARD_MAX_POSITION,
    BOARD_MIN_POSITION,
    EMPTY_CHAR,
    JOKER_CHAR,
    MIDDLE_OF_BOARD,
    ONE,
    RACK_LETTER_COUNT,
    THREE,
    ZERO,
} from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { getRandomInt } from '@app/GameLogic/utils';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { UIPlace } from './ui-place';

describe('UIPlace', () => {
    let player: Player;
    let action: UIPlace;
    let boardService: BoardService;
    let pointCalculator: PointCalculatorService;
    let wordSearcher: WordSearcher;
    const dict = new DictionaryService();
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: dict }],
        });
        boardService = TestBed.inject(BoardService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        wordSearcher = TestBed.inject(WordSearcher);

        player = new User('p1');
        player.letterRack = [
            { char: 'A', value: 0 },
            { char: 'B', value: 0 },
            { char: 'C', value: 0 },
            { char: JOKER_CHAR, value: 0 },
            { char: 'E', value: 0 },
            { char: 'F', value: 0 },
            { char: 'G', value: 0 },
        ];
        action = new UIPlace(player, pointCalculator, wordSearcher, boardService);
    });

    it('should create an instance', () => {
        expect(action).toBeTruthy();
    });

    it('should return the appropriate canBeCreated boolean', () => {
        expect(action.canBeCreated).toBeFalsy();
        action.concernedIndexes.add(0);
        action.orderedIndexes.push({ x: 0, y: 0, rackIndex: 0 });
        expect(action.canBeCreated).toBeTruthy();
        action.concernedIndexes.delete(0);
        action.orderedIndexes.pop();
        expect(action.canBeCreated).toBeFalsy();
    });

    it('should set the pointerPosition and direction properly following a left click', () => {
        const x = getRandomInt(BOARD_MAX_POSITION, BOARD_MIN_POSITION);
        const y = getRandomInt(BOARD_MAX_POSITION, BOARD_MIN_POSITION);
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).not.toBeNull();
        expect(action.pointerPosition).toEqual({ x, y });
        expect(action.direction).toBe(Direction.Horizontal);
    });

    it('should set the pointerPosition and direction properly following a second left click', () => {
        const x = getRandomInt(BOARD_MAX_POSITION, BOARD_MIN_POSITION);
        const y = getRandomInt(BOARD_MAX_POSITION, BOARD_MIN_POSITION);
        action.receiveLeftClick({ x, y });
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).not.toBeNull();
        expect(action.pointerPosition).toEqual({ x, y });
        expect(action.direction).toBe(Direction.Vertical);
    });

    it('should set the pointerPosition and direction properly following a second third click', () => {
        const x = getRandomInt(BOARD_MAX_POSITION, BOARD_MIN_POSITION);
        const y = getRandomInt(BOARD_MAX_POSITION, BOARD_MIN_POSITION);
        action.receiveLeftClick({ x, y });
        action.receiveLeftClick({ x, y });
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).not.toBeNull();
        expect(action.pointerPosition).toEqual({ x, y });
        expect(action.direction).toBe(Direction.Horizontal);
    });

    it('should not set the pointerPosition and direction following an invalid left click', () => {
        const x = BOARD_MAX_POSITION + 1;
        const y = getRandomInt(BOARD_MAX_POSITION, BOARD_MIN_POSITION);
        action.receiveLeftClick({ x, y });
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).toBeNull();
    });

    it('should not set the direction following following a left click while letters are selected', () => {
        const x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        const initialDirection = action.direction;
        action.receiveLeftClick({ x, y });
        const randomIndex = getRandomInt(RACK_LETTER_COUNT - 1);
        const letter = player.letterRack[randomIndex].char.toLowerCase();
        action.receiveKey(letter);
        action.receiveLeftClick({ x: x + 1, y });
        expect(action.pointerPosition).toEqual({ x: x + 1, y });
        expect(action.canBeCreated).toBeTruthy();
        expect(action.direction).toEqual(initialDirection);
    });

    it('should not set the pointerPosition following a left click while letters are selected', () => {
        let x = 0;
        let y = 0;
        action.receiveLeftClick({ x, y });
        action.concernedIndexes.add(0);
        action.orderedIndexes.push({ x: 0, y: 0, rackIndex: 0 });
        x = getRandomInt(BOARD_MAX_POSITION, 1);
        y = getRandomInt(BOARD_MAX_POSITION, 1);
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).not.toEqual({ x, y });
    });

    it('should properly update the pointerPosition following a keyPress (horizontal)', () => {
        const indexes = [0, getRandomInt(RACK_LETTER_COUNT - 2, 1), RACK_LETTER_COUNT - 1]; // first, ~middle, last
        action.receiveLeftClick({ x: MIDDLE_OF_BOARD, y: MIDDLE_OF_BOARD });
        let movedX = MIDDLE_OF_BOARD;
        for (const rackIndex of indexes) {
            const letter = player.letterRack[rackIndex].char.toLowerCase();
            action.receiveKey(letter);
            expect(action.pointerPosition).toEqual({ x: ++movedX, y: MIDDLE_OF_BOARD });
        }
        expect(action.concernedIndexes.size).toBe(indexes.length);
        expect(action.orderedIndexes.length).toBe(indexes.length);
        expect(action.pointerPosition).toEqual({ x: MIDDLE_OF_BOARD + indexes.length, y: MIDDLE_OF_BOARD });
    });

    it('should properly update the pointerPosition following a keyPress (vertical)', () => {
        const indexes = [0, getRandomInt(RACK_LETTER_COUNT - 2, 1), RACK_LETTER_COUNT - 1]; // first, ~middle, last
        action.receiveLeftClick({ x: MIDDLE_OF_BOARD, y: MIDDLE_OF_BOARD });
        action.receiveLeftClick({ x: MIDDLE_OF_BOARD, y: MIDDLE_OF_BOARD });
        let movedY = MIDDLE_OF_BOARD;
        for (const rackIndex of indexes) {
            const letter = player.letterRack[rackIndex].char.toLowerCase();
            action.receiveKey(letter);
            expect(action.pointerPosition).toEqual({ x: MIDDLE_OF_BOARD, y: ++movedY });
        }
        expect(action.concernedIndexes.size).toBe(indexes.length);
        expect(action.orderedIndexes.length).toBe(indexes.length);
        expect(action.pointerPosition).toEqual({ x: MIDDLE_OF_BOARD, y: MIDDLE_OF_BOARD + indexes.length });
    });

    it('should not update the pointerPosition following an invalid keyPress', () => {
        const x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).toEqual({ x, y });
        action.receiveKey('z');
        expect(action.pointerPosition).toEqual({ x, y });
        expect(action.concernedIndexes.size).toBe(ZERO);
        expect(action.orderedIndexes.length).toBe(ZERO);
    });

    it('should update the pointerPosition following an uppercase letter keyPress (using joker)', () => {
        let x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).toEqual({ x, y });
        action.receiveKey('Z');
        expect(action.pointerPosition).toEqual({ x: ++x, y });
        expect(action.concernedIndexes.size).toBe(ONE);
        expect(action.orderedIndexes.length).toBe(ONE);
        expect(action.orderedIndexes[0].rackIndex).toBe(THREE);
    });

    it('should not update while using letters the player does not have and no joker to use (lowercase)', () => {
        player.letterRack[THREE].char = 'I';
        const x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).toEqual({ x, y });
        action.receiveKey('z');
        expect(action.pointerPosition).toEqual({ x, y });
        expect(action.concernedIndexes.size).toBe(ZERO);
        expect(action.orderedIndexes.length).toBe(ZERO);
    });

    it('should not update while using letters the player does not have and no joker to use (uppercase)', () => {
        player.letterRack[THREE].char = 'I';
        const x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).toEqual({ x, y });
        action.receiveKey('Z');
        expect(action.pointerPosition).toEqual({ x, y });
        expect(action.concernedIndexes.size).toBe(ZERO);
        expect(action.orderedIndexes.length).toBe(ZERO);
    });

    it('should allow the player to use letters with accents and correctly translate them', () => {
        player.letterRack[THREE].char = 'I';
        let x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).toEqual({ x, y });
        const accentLetters = ['à', 'é', 'ï'];
        for (const accentLetter of accentLetters) {
            action.receiveKey(accentLetter);
            expect(action.pointerPosition).toEqual({ x: ++x, y });
        }
        expect(action.concernedIndexes.size).toBe(accentLetters.length);
        expect(action.orderedIndexes.length).toBe(accentLetters.length);
    });

    it('should allow the player to use letters with accents and correctly translate them (using a joker)', () => {
        let x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).toEqual({ x, y });
        const accentLetter = 'Ï';
        action.receiveKey(accentLetter);
        expect(action.pointerPosition).toEqual({ x: ++x, y });
        expect(action.concernedIndexes.size).toBe(ONE);
        expect(action.orderedIndexes.length).toBe(ONE);
    });

    it('should not allow the player to use letters with accents as joker if not uppercase', () => {
        const x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).toEqual({ x, y });
        const accentLetter = 'ï';
        action.receiveKey(accentLetter);
        expect(action.pointerPosition).toEqual({ x, y });
        expect(action.concernedIndexes.size).toBe(ZERO);
        expect(action.orderedIndexes.length).toBe(ZERO);
    });

    it('should set the pointerPosition to null when overflowing', () => {
        const x = BOARD_MAX_POSITION;
        const y = BOARD_MAX_POSITION;
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).toEqual({ x, y });
        const randomIndex = getRandomInt(RACK_LETTER_COUNT - 1);
        const letter = player.letterRack[randomIndex].char.toLowerCase();
        action.receiveKey(letter);
        expect(action.pointerPosition).toBeNull();
    });

    it('should properly update the pointerPosition to the last placed letter following a backspace (horizontal)', () => {
        const indexes = [0, getRandomInt(RACK_LETTER_COUNT - 2, 1), RACK_LETTER_COUNT - 1]; // first, ~middle, last
        let x = MIDDLE_OF_BOARD;
        let y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        for (const rackIndex of indexes) {
            x += getRandomInt(THREE, ONE);
            action.concernedIndexes.add(rackIndex);
            action.orderedIndexes.push({ x, y, rackIndex });
        }
        expect(action.concernedIndexes.size).toBe(indexes.length);
        expect(action.orderedIndexes.length).toBe(indexes.length);

        while (action.orderedIndexes.length > 0) {
            const lastPlacement = action.orderedIndexes[action.orderedIndexes.length - 1];
            x = lastPlacement.x;
            y = lastPlacement.y;
            action.receiveKey(BACKSPACE);
            expect(action.pointerPosition).toEqual({ x, y });
        }
        action.receiveKey(BACKSPACE);
        expect(action.pointerPosition).toEqual({ x, y });
    });

    it('should properly update the pointerPosition to the last placed letter following a backspace (vertical)', () => {
        const indexes = [0, getRandomInt(RACK_LETTER_COUNT - 2, 1), RACK_LETTER_COUNT - 1]; // first, ~middle, last
        let x = MIDDLE_OF_BOARD;
        let y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        action.receiveLeftClick({ x, y });
        for (const rackIndex of indexes) {
            y += getRandomInt(THREE, ONE);
            action.concernedIndexes.add(rackIndex);
            action.orderedIndexes.push({ x, y, rackIndex });
        }
        expect(action.concernedIndexes.size).toBe(indexes.length);
        expect(action.orderedIndexes.length).toBe(indexes.length);

        while (action.orderedIndexes.length > 0) {
            const lastPlacement = action.orderedIndexes[action.orderedIndexes.length - 1];
            x = lastPlacement.x;
            y = lastPlacement.y;
            action.receiveKey(BACKSPACE);
            expect(action.pointerPosition).toEqual({ x, y });
        }
        action.receiveKey(BACKSPACE);
        expect(action.pointerPosition).toEqual({ x, y });
    });

    it('should properly place all letters on the grid while receiving valid keypress', () => {
        player.letterRack[THREE].char = 'I';
        let movedX = MIDDLE_OF_BOARD;
        const stableY = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x: movedX, y: stableY });
        for (let rackIndex = 0; rackIndex < RACK_LETTER_COUNT; rackIndex++) {
            const letter = player.letterRack[rackIndex].char.toLowerCase();
            action.receiveKey(letter);
            expect(boardService.board.grid[stableY][movedX++].letterObject.char.toLowerCase()).toBe(letter);
        }
    });

    it('should properly place all letters on the grid while receiving valid keypress (using joker)', () => {
        let movedX = MIDDLE_OF_BOARD;
        const stableY = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x: movedX, y: stableY });
        for (let rackIndex = 0; rackIndex < RACK_LETTER_COUNT; rackIndex++) {
            let letter = player.letterRack[rackIndex].char.toLowerCase();
            if (letter === JOKER_CHAR) {
                letter = 'Z';
            }
            action.receiveKey(letter);
            expect(boardService.board.grid[stableY][movedX++].letterObject.char.toLowerCase()).toBe(letter.toLowerCase());
        }
    });

    it('should not place letters while receiving invalid keypress', () => {
        player.letterRack[THREE].char = 'I';
        const x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        action.receiveKey('z');
        expect(boardService.board.grid[y][x].letterObject.char.toLowerCase()).toBe(EMPTY_CHAR);
    });

    it('should properly remove all letters from grid when UIPlace is cancelled', () => {
        player.letterRack[THREE].char = 'I';
        let movedX = MIDDLE_OF_BOARD;
        const stableY = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x: movedX, y: stableY });
        for (let rackIndex = 0; rackIndex < RACK_LETTER_COUNT; rackIndex++) {
            const letter = player.letterRack[rackIndex].char.toLowerCase();
            action.receiveKey(letter);
        }
        action.destroy();
        movedX = MIDDLE_OF_BOARD;
        for (let rackIndex = 0; rackIndex < RACK_LETTER_COUNT; rackIndex++) {
            expect(boardService.board.grid[stableY][movedX++].letterObject.char.toLowerCase()).toBe(EMPTY_CHAR);
        }
    });

    it('should properly retreive the corrrect word and position from the board when create the PlacerLetter (horizontal)', () => {
        player.letterRack[THREE].char = 'I';
        const x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        let expectedWord = '';
        for (let rackIndex = 0; rackIndex < RACK_LETTER_COUNT; rackIndex++) {
            const letter = player.letterRack[rackIndex].char.toLowerCase();
            expectedWord += letter;
            action.receiveKey(letter);
        }
        const placeLetterAction = action.create() as PlaceLetter;
        expect(placeLetterAction.word).toBe(expectedWord);
        expect(placeLetterAction.placement).toEqual({ x, y, direction: action.direction });
    });

    it('should properly retreive the correct word and position from the board when create the PlacerLetter (vertical)', () => {
        player.letterRack[THREE].char = 'I';
        const x = MIDDLE_OF_BOARD;
        const y = MIDDLE_OF_BOARD;
        action.receiveLeftClick({ x, y });
        action.receiveLeftClick({ x, y });
        let expectedWord = '';
        for (let rackIndex = 0; rackIndex < RACK_LETTER_COUNT; rackIndex++) {
            const letter = player.letterRack[rackIndex].char.toLowerCase();
            expectedWord += letter;
            action.receiveKey(letter);
        }
        const placeLetterAction = action.create() as PlaceLetter;
        expect(placeLetterAction.word).toBe(expectedWord);
        expect(placeLetterAction.placement).toEqual({ x, y, direction: action.direction });
    });

    it('should not do anything when receiving a RightClick', () => {
        action.receiveRightClick();
        expect().nothing();
    });

    it('should not do anything when receiving a MouseRoll', () => {
        action.receiveRoll();
        expect().nothing();
    });
});
