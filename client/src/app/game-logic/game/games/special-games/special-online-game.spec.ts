import { TestBed } from '@angular/core/testing';
import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { SpecialOnlineGame } from '@app/game-logic/game/games/special-games/special-online-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';

describe('OnlineGame', () => {
    let game: SpecialOnlineGame;
    let boardService: BoardService;
    let gameSocketHandlerService: GameSocketHandlerService;
    let timer: TimerService;
    let player1: Player;
    let player2: Player;
    const dict = new DictionaryService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: dict }],
        });
        boardService = TestBed.inject(BoardService);
        gameSocketHandlerService = TestBed.inject(GameSocketHandlerService);
        timer = TestBed.inject(TimerService);

        game = new SpecialOnlineGame(
            '0',
            DEFAULT_TIME_PER_TURN,
            'p1',
            timer,
            gameSocketHandlerService,
            boardService,
            TestBed.inject(OnlineActionCompilerService),
        );
        player1 = new User('p1');
        player2 = new User('p2');
        game.players = [player1, player2];
    });

    it('should create an instance', () => {
        expect(game).toBeTruthy();
    });
});
