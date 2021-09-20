import { Board } from '@app/GameLogic/game/board';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher';

describe('WordSearcher', () => {
    let wordSearcher: WordSearcher;
    const board: Board = new Board();
    beforeEach(() => {
        wordSearcher = new WordSearcher(board);
    });

    it('should be created', () => {
        expect(wordSearcher).toBeTruthy();
    });
});
