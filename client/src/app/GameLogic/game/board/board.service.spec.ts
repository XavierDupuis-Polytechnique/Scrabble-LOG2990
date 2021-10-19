/* eslint-disable @typescript-eslint/no-magic-numbers */
/* tslint:disable:no-unused-variable */

import { BoardService } from './board.service';

describe('board service', () => {
    const boardService = new BoardService();

    it('should have property board', () => {
        expect(boardService.board).toBeDefined();
    });
});
