import { TestBed } from '@angular/core/testing';
import { UIAction } from '@app/GameLogic/actions/ui-actions/ui-action';
import { JOKER_CHAR } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { UIPlace } from './ui-place';

fdescribe('UIPlace', () => {
    let player: Player;
    let action: UIAction;
    let boardService: BoardService;
    let pointCalculator: PointCalculatorService;
    let wordSearcher: WordSearcher;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BoardService, PointCalculatorService, WordSearcher],
        });
        boardService = TestBed.inject(BoardService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        wordSearcher = TestBed.inject(WordSearcher);

        player = new User('p1');
        player.letterRack = [
            { char: 'A', value: 0 },
            { char: 'B', value: 0 },
            { char: 'C', value: 0 },
            { char: JOKER_CHAR, value: 0 },
            { char: 'E', value: 0 },
            { char: 'F', value: 0 },
            { char: 'G', value: 0 },
        ];
        action = new UIPlace(player, pointCalculator, wordSearcher, boardService);
    });

    it('should create an instance', () => {
        expect(action).toBeTruthy();
    });

    it('should create an instance', () => {
        expect(action).toBeTruthy();
    });
});
