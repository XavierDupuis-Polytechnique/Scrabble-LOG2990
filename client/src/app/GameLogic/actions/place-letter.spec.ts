import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';
import { PlaceLetter, PlacementSetting } from './place-letter';

describe('PlaceLetter', () => {
    const letterToPlace: Letter[] = [
        { char: 'A', value: 1 },
        { char: 'L', value: 1 },
        { char: 'L', value: 1 },
        { char: 'O', value: 1 },
    ];

    const placement: PlacementSetting = {
        x: 0,
        y: 0,
        direction: 'H',
    };
    let game: Game;
    const player1: Player = new User('Tim');
    const player2: Player = new User('George');
    beforeEach(() => {
        game = new Game(1, new TimerService(), new PointCalculatorService(), new BoardService());
        game.players.push(player1);
        game.players.push(player2);

        game.start();
    });

    it('should create an instance', () => {
        expect(new PlaceLetter(game.getActivePlayer(), letterToPlace, placement)).toBeTruthy();
    });

    it('should place letter at right place', () => {
        const placeAction = new PlaceLetter(game.getActivePlayer(), letterToPlace, placement);
        placeAction.execute(game);
        for (let i = 0; i < letterToPlace.length; i++) {
            expect(game.board.grid[i][0].letterObject.char).toBe(letterToPlace[i].char);
        }
    });
});
