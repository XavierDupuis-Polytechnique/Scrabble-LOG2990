import { TestBed } from '@angular/core/testing';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { LetterPlacement } from '@app/GameLogic/actions/ui-actions/ui-place-interface';
import {
    BACKSPACE,
    BOARD_MAX_POSITION,
    BOARD_MIN_POSITION,
    JOKER_CHAR,
    MIDDLE_OF_BOARD,
    ONE,
    RACK_LETTER_COUNT,
    THREE,
    ZERO
} from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { getRandomInt } from '@app/GameLogic/utils';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { UIPlace } from './ui-place';

fdescribe('UIPlace', () => {
    let player: Player;
    let action: UIPlace;
    let boardService: BoardService;
    let pointCalculator: PointCalculatorService;
    let wordSearcher: WordSearcher;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BoardService, PointCalculatorService, WordSearcher],
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
        const placement: LetterPlacement = { x: 0, y: 0, rackIndex: 0 };
        expect(action.canBeCreated).toBeFalsy();
        action.orderedIndexes.push(placement);
        expect(action.canBeCreated).toBeTruthy();
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

    it('should not set the pointerPosition and direction following an invalid left click', () => {
        const x = BOARD_MAX_POSITION + 1;
        const y = getRandomInt(BOARD_MAX_POSITION, BOARD_MIN_POSITION);
        action.receiveLeftClick({ x, y });
        action.receiveLeftClick({ x, y });
        expect(action.pointerPosition).toBeNull();
    });

    it('should not set the pointerPosition and direction following a left click while letters are selected', () => {
        let x = 0;
        let y = 0;
        action.receiveLeftClick({ x, y });
        action.concernedIndexes.add(0);
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
});
