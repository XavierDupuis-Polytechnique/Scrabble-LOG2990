import { DEFAULT_TIME_PER_TURN } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
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
        game = new Game(
            DEFAULT_TIME_PER_TURN,
            timer,
            new PointCalculatorService(),
            new BoardService(),
            new MessagesService(new CommandParserService()),
        );
        game.players.push(player1);
        game.players.push(player2);
        game.start();
    });

    it('should create an instance', () => {
        expect(new PassTurn(new User('Tim'))).toBeTruthy();
    });

    it('should pass turn', () => {
        const beforePlayer: Player = game.getActivePlayer();
        const passAction = new PassTurn(beforePlayer);
        passAction.execute(game);
        passAction.player.action$.next(passAction);
        const afterPlayer: Player = game.getActivePlayer();
        expect(beforePlayer.name !== afterPlayer.name).toBeTrue();
    });
});
