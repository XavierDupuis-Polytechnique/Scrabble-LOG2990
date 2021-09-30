import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { DEFAULT_TIME_PER_TURN } from '@app/GameLogic/constants';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';

describe('PassTurn', () => {
    let game: Game;
    const player1: Player = new User('Tim');
    const player2: Player = new User('George');
    let timer: TimerService;

    beforeEach(() => {
        timer = new TimerService();
        const boardService = new BoardService();
        game = new Game(
            DEFAULT_TIME_PER_TURN,
            timer,
            new PointCalculatorService(boardService),
            boardService,
            new MessagesService(new CommandParserService(), new GameInfoService(new TimerService())),
        );
        game.players.push(player1);
        game.players.push(player2);
    });

    it('should create an instance', () => {
        expect(new PassTurn(new User('Tim'))).toBeTruthy();
    });

    it('should pass turn', () => {
        game.start();
        const beforePlayer: Player = game.getActivePlayer();
        const passAction = new PassTurn(beforePlayer);
        beforePlayer.play(passAction);
        const afterPlayer: Player = game.getActivePlayer();
        expect(beforePlayer.name).not.toBe(afterPlayer.name);
    });
});
