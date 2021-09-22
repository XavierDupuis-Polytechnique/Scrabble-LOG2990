import { HardBot } from '@app/GameLogic/player/hard-bot';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';

describe('HardBot', () => {
    let bot: HardBot;
    let board: BoardService;
    let dictionary: DictionaryService;
    beforeEach(() => {
        board = new BoardService();
        dictionary = new DictionaryService();
        bot = new HardBot('Tim', board, dictionary);
    });

    it('should create an instance', () => {
        expect(bot).toBeTruthy();
    });
});
