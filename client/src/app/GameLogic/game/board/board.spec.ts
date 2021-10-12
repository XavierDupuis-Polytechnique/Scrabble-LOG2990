/* eslint-disable @typescript-eslint/no-magic-numbers */
// import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { ASCII_CODE, BOARD_DIMENSION } from '@app/GameLogic/constants';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { Board, multiplicators, MultiType } from './board';

describe('Board test', () => {
    let board: Board;
    const randomBonus = false;
    const letterCreator = new LetterCreator();

    beforeEach(() => {
        board = new Board(randomBonus);
    });
    it('Board size', () => {
        expect(board.grid.length).toBe(BOARD_DIMENSION);
        board.grid.forEach((row) => {
            expect(row.length).toBe(BOARD_DIMENSION);
        });
    });

    it('Board default value at right place', () => {
        multiplicators.forEach((elem) => {
            if (elem.type === MultiType.Letter) {
                expect(board.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].letterMultiplicator).toBe(elem.v);
            } else {
                expect(board.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].wordMultiplicator).toBe(elem.v);
            }
        });
    });

    it('should x + 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(4, 5);
        expect(board.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('should x - 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(6, 5);
        expect(board.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('should y + 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(5, 4);
        expect(board.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('should y - 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(4, 6);
        expect(board.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('position should have random tile multiplicator', () => {
        const randomBoard = new Board(true);
        expect(randomBoard.listMultiplicator).not.toEqual(multiplicators);
    });
});
