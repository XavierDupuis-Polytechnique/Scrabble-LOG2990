import { DEFAULT_TIME_PER_TURN } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';

describe('PassTurn', () => {
    let game: Game;
    const player1: Player = new User('Tim');
    const player2: Player = new User('George');
    let gis: GameInfoService;
    let timer: TimerService;

    beforeEach(() => {
        timer = new TimerService();
        gis = new GameInfoService();
        game = new Game(DEFAULT_TIME_PER_TURN, timer, new PointCalculatorService(), new BoardService(), gis);
        game.players.push(player1);
        game.players.push(player2);
        gis.receiveReferences(timer, game);
        game.start();
    });

    it('should create an instance', () => {
        expect(new PassTurn(new User('Tim'))).toBeTruthy();
    });

    it('should pass turn', () => {
        const beforePlayer: Player = game.info.getActivePlayer();
        const passAction = new PassTurn(beforePlayer);
        passAction.execute(game);
        passAction.player.action$.next(passAction);
        const afterPlayer: Player = game.info.getActivePlayer();
        expect(beforePlayer.name !== afterPlayer.name).toBeTrue();
    });
});
