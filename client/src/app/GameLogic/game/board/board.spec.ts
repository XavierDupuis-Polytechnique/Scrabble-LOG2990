import { ASCII_CODE, BOARD_DIMENSION } from '@app/GameLogic/constants';
import { Board, letterMultiplicator, wordMultiplicator } from './board';

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

    it('Board desactivate letter multiplicator ', () => {
        expect(board.grid[0][3].letterMultiplicator).toEqual(2);
        board.desactivateLetterMultiplicator(3, 0);
        expect(board.grid[0][3].letterMultiplicator).toEqual(1);
    });

    it('Board desactivate word multiplicator ', () => {
        expect(board.grid[0][0].wordMultiplicator).toEqual(3);
        board.desactivateWordMultiplicator(0, 0);
        expect(board.grid[0][0].wordMultiplicator).toEqual(1);
    });
});
