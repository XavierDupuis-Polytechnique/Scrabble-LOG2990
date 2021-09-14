// import { TestBed } from '@angular/core/testing';

import { Board } from './board';

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

    it('Board default value', () => {
        board.grid.forEach((row) => {
            row.forEach((tile) => {
                tile.letterO.letter = ' ';
                tile.letterMultiplicator = 1;
                tile.wordMultiplicator = 1;
            });
        });
    });

    // Todo check default multiplicator in right place
});
