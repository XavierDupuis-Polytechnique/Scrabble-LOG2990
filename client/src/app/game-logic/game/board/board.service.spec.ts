import { BoardService } from './board.service';

describe('board service', () => {
    const boardService = new BoardService();

    it('should have property board', () => {
        expect(boardService.board).toBeDefined();
    });
});
