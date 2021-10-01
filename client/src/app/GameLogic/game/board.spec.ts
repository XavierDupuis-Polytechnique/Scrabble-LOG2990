// import { TestBed } from '@angular/core/testing';

import { BOARD_DIMENSION } from '@app/GameLogic/constants';
import { ASCII_CODE, Board, letterMultiplicator, wordMultiplicator } from './board';

describe('Board test', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board();
    });
    it('Board size', () => {
        expect(board.grid.length).toBe(BOARD_DIMENSION);
        board.grid.forEach((row) => {
            expect(row.length).toBe(BOARD_DIMENSION);
        });
    });

    it('Board default value at right place', () => {
        wordMultiplicator.forEach((elem) => {
            expect(board.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].wordMultiplicator).toBe(elem.v);
        });

        letterMultiplicator.forEach((elem) => {
            expect(board.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].letterMultiplicator).toBe(elem.v);
        });
    });
});
