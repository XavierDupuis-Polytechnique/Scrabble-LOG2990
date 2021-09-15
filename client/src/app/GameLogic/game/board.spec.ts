// import { TestBed } from '@angular/core/testing';

import { Board, wordMultiplicator } from './board';

describe('Board test', () => {
    let board: Board;
    const boardSize = 15;

    beforeEach(() => {
        board = new Board();
    });
    it('Board size', () => {
        expect(board.grid.length).toBe(boardSize);
        board.grid.forEach((row) => {
            expect(row.length).toBe(boardSize);
        });
    });

    it('Board default value at right place', () => {
        wordMultiplicator.forEach((elem) => {
            expect(board.grid[elem.x - 1][elem.y.charCodeAt(0)].wordMultiplicator).toBe(elem.v);
    it('Board default value', () => {
        board.grid.forEach((row) => {
            row.forEach((tile) => {
                tile.letterObject.char = ' ';
                tile.letterMultiplicator = 1;
                tile.wordMultiplicator = 1;
            });
        });
    });
});
