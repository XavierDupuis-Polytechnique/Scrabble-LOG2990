/* eslint-disable @typescript-eslint/no-magic-numbers */
/* tslint:disable:no-unused-variable */

import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { BoardService } from './board.service';

describe('board service', () => {
    const boardService = new BoardService();
    const letterCreator = new LetterCreator();

    it('should have property board', () => {
        expect(boardService.board).toBeDefined();
    });

    it('should x + 1 hasNeighbour', () => {
        boardService.board.grid[5][5].letterObject = letterCreator.createLetter('A');
        boardService.hasNeighbour(4, 5);
        expect(boardService.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('should x - 1 hasNeighbour', () => {
        boardService.board.grid[5][5].letterObject = letterCreator.createLetter('A');
        boardService.hasNeighbour(6, 5);
        expect(boardService.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('should y + 1 hasNeighbour', () => {
        boardService.board.grid[5][5].letterObject = letterCreator.createLetter('A');
        boardService.hasNeighbour(5, 4);
        expect(boardService.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('should y - 1 hasNeighbour', () => {
        boardService.board.grid[5][5].letterObject = letterCreator.createLetter('A');
        boardService.hasNeighbour(4, 6);
        expect(boardService.hasNeighbour(4, 5)).toBeTruthy();
    });
});
