import { DEFAULT_TIME_PER_TURN } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { Game } from '@app/GameLogic/game/games/game';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';

describe('PlaceLetter', () => {
    let timer: TimerService;

    const lettersToPlace = 'bateau';

    const placement: PlacementSetting = {
        x: 0,
        y: 0,
        direction: 'H',
    };
    let game: Game;
    const player1: Player = new User('Tim');
    const player2: Player = new User('George');
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
        const letterCreator = new LetterCreator();
        const letterObjects = letterCreator.createLetters(lettersToPlace.split(''));
        for (let i = 0; i < letterObjects.length; i++) {
            game.getActivePlayer().letterRack[i] = letterObjects[i];
        }
    });

    it('should create an instance', () => {
        expect(new PlaceLetter(game.getActivePlayer(), lettersToPlace, placement)).toBeTruthy();
    });

    it('should place letter at right place', () => {
        const placeAction = new PlaceLetter(game.getActivePlayer(), lettersToPlace, placement);
        placeAction.execute(game);
        for (let i = 0; i < lettersToPlace.length; i++) {
            expect(game.board.grid[0][i].letterObject.char).toBe(lettersToPlace.charAt(i).toUpperCase());
        }
    });

    it('should have proper revert behavior', () => {
        const placeAction = new PlaceLetter(game.getActivePlayer(), lettersToPlace, placement);
        placeAction.execute(game);
        placeAction.revert();
        for (let i = 0; i < lettersToPlace.length; i++) {
            expect(game.board.grid[i][0].letterObject.char).toBe(' ');
        }
    });
});
