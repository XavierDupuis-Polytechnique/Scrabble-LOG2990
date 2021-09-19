import { TestBed } from '@angular/core/testing';
import { DEFAULT_TIME_PER_TURN } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { EasyBot } from '@app/GameLogic/player/easy-bot';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { NUM_TILES } from '../game/board';
import { LetterBag } from '../game/letter-bag';

describe('ActionValidatorService', () => {
    let service: ActionValidatorService;
    let game: Game;
    let p1User: User;
    let p2Bot: EasyBot;
    let currentPlayer: Player;
    let lettersToExchange: Letter[];
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let board: BoardService;
    let dictonary: DictionaryService;

    // FIX les tests, car ils sont trop dépendants des autres services
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PointCalculatorService, BoardService, DictionaryService, TimerService],
        });
        service = TestBed.inject(ActionValidatorService);
        timer = new TimerService();
        pointCalculator = new PointCalculatorService();
        board = new BoardService();
        game = new Game(DEFAULT_TIME_PER_TURN, timer, pointCalculator, board);
        p1User = new User('testUser');
        p2Bot = new EasyBot('testUser', board, dictonary);
        game.players.push(p1User);
        game.players.push(p2Bot);
        game.start();
        currentPlayer = game.getActivePlayer();
    });

    it('should be referenced', () => {
        expect(new ActionValidatorService()).toEqual(service);
    });

    /// TURN + PASSTURN TESTS ///
    it('should validate a valid PassTurn', () => {
        const action = new PassTurn(currentPlayer);
        expect(service.validateAction(action, game)).toBeTruthy();
    });

    it('should invalidate an invalid PassTurn because the player tried to perform an action outside of its turn', () => {
        const otherPlayer = currentPlayer === p1User ? p2Bot : p1User;
        const action = new PassTurn(otherPlayer);
        expect(service.validateAction(action, game)).not.toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because the player tried to perform an action outside of its turn', () => {
        const otherPlayer = currentPlayer === p1User ? p2Bot : p1User;
        const action = new ExchangeLetter(otherPlayer, []);
        expect(service.validateAction(action, game)).not.toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the player tried to perform an action outside of its turn', () => {
        const otherPlayer = currentPlayer === p1User ? p2Bot : p1User;
        const action = new PlaceLetter(otherPlayer, [], { x: 0, y: 0, direction: '' });
        expect(service.validateAction(action, game)).not.toBeTruthy();
    });
    /// ////////////////// ///

    /// EXCHANGELETTER TESTS ///
    it('should validate a valid ExchangeLetter because 7 letters from the player rack can be exchanged', () => {
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack);
        expect(service.validateAction(action, game)).toBeTruthy();
    });

    it('should validate a valid ExchangeLetter because less than 7 letters from the player rack can be exchanged', () => {
        lettersToExchange = [currentPlayer.letterRack[4], currentPlayer.letterRack[6]];
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service.validateAction(action, game)).toBeTruthy();
    });

    it('should validate a valid ExchangeLetter because the game letterBag has enough letters', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length - 10);
        lettersToExchange = [...currentPlayer.letterRack].splice(0, 1);
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service.validateAction(action, game)).toBeTruthy();
    });

    it('should validate a valid ExchangeLetter because a player 7 letters can be exchanged', () => {
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack);
        expect(service.validateAction(action, game)).toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because the game letterBag doesnt have letters', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length);
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack);
        expect(service.validateAction(action, game)).not.toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because the game letterBag doesnt have enough letters', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length - 2); // 102 - 100 = 2 letters remaining
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack.splice(0, 2)); // 7 - 2 = 5 letters to exchange
        expect(service.validateAction(action, game)).not.toBeTruthy();
    });

    it('should validate a valid ExchangeLetter because a player can exchange many of the same letter', () => {
        currentPlayer.letterRack = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
        ];
        lettersToExchange = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service.validateAction(action, game)).toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because a player cannot exchange more of the same letter he/she has', () => {
        currentPlayer.letterRack = [
            { char: 'A', value: 1 },
            { char: 'B', value: 1 },
            { char: 'C', value: 1 },
            { char: 'D', value: 1 },
            { char: 'E', value: 1 },
        ];
        lettersToExchange = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'B', value: 1 },
            { char: 'C', value: 1 },
            { char: 'D', value: 1 },
        ];
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service.validateAction(action, game)).not.toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because a player cannot exchange letters not in its letterRack', () => {
        lettersToExchange = [{ char: 'NOT_A_LETTER', value: 666 }];
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service.validateAction(action, game)).not.toBeTruthy();
    });
    /// ////////////////// ///

    /// PLACELETTER TESTS ///
    it('should validate a valid PlaceLetter because the letter Tile is empty (horizontal)', () => {
        const lettersToPlace = [{ char: 'A', value: 1 }];
        const placement: PlacementSetting = { direction: 'h', x: 0, y: 0 };
        currentPlayer.letterRack[0] = lettersToPlace[0];
        const action = new PlaceLetter(currentPlayer, lettersToPlace, placement);
        expect(service.validateAction(action, game)).toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the letter Tile is empty (vertical)', () => {
        const lettersToPlace = [{ char: 'A', value: 1 }];
        const placement: PlacementSetting = { direction: 'v', x: 0, y: 0 };
        currentPlayer.letterRack[0] = lettersToPlace[0];
        const action = new PlaceLetter(currentPlayer, lettersToPlace, placement);
        expect(service.validateAction(action, game)).toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the letter Tile next to it is empty', () => {
        const lettersToPlace = [{ char: 'A', value: 1 }];
        const placement: PlacementSetting = { direction: 'v', x: 0, y: 0 };
        currentPlayer.letterRack[0] = lettersToPlace[0];
        const action = new PlaceLetter(currentPlayer, lettersToPlace, placement);
        expect(service.validateAction(action, game)).toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the Tile is occupied and there no Tile next to it', () => {
        const x = NUM_TILES - 1;
        const y = NUM_TILES - 1;
        game.board.grid[x][y].letterObject.char = '_';
        const lettersToPlace = [{ char: 'A', value: 1 }];
        const placement: PlacementSetting = { direction: 'h', x, y };
        currentPlayer.letterRack[0] = lettersToPlace[0];
        const action = new PlaceLetter(currentPlayer, lettersToPlace, placement);
        expect(service.validateAction(action, game)).not.toBeTruthy();
    });

    it('should validate placing a "word" with already present letters on the board (horizontal)', () => {
        const finalBoardRowChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
        const lettersToPlace: Letter[] = [];
        for (let i = 0; i < finalBoardRowChars.length; i++) {
            if (i % 2) {
                currentPlayer.letterRack[i % 7].char = finalBoardRowChars[i];
                lettersToPlace.push({ char: finalBoardRowChars[i], value: 1 });
            } else {
                game.board.grid[i][0].letterObject.char = finalBoardRowChars[i];
            }
        }
        const placement: PlacementSetting = { direction: 'h', x: 0, y: 0 };
        const action = new PlaceLetter(currentPlayer, lettersToPlace, placement);

        expect(service.validateAction(action, game)).toBeTruthy();

        action.execute(game);

        for (let j = 0; j < finalBoardRowChars.length; j++) {
            expect(game.board.grid[j][0].letterObject.char).toBe(finalBoardRowChars[j]);
        }
    });

    it('should validate placing a "word" with already present letters on the board (vertical)', () => {
        const finalBoardRowChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
        const lettersToPlace: Letter[] = [];
        for (let i = 0; i < finalBoardRowChars.length; i++) {
            if (i % 2) {
                currentPlayer.letterRack[i % LetterBag.playerLetterCount].char = finalBoardRowChars[i];
                lettersToPlace.push({ char: finalBoardRowChars[i], value: 1 });
            } else {
                game.board.grid[0][i].letterObject.char = finalBoardRowChars[i];
            }
        }
        const placement: PlacementSetting = { direction: 'v', x: 0, y: 0 };
        const action = new PlaceLetter(currentPlayer, lettersToPlace, placement);

        expect(service.validateAction(action, game)).toBeTruthy();

        action.execute(game);

        for (let j = 0; j < finalBoardRowChars.length; j++) {
            expect(game.board.grid[0][j].letterObject.char).toBe(finalBoardRowChars[j]);
        }
    });

    it('should invalidate placing a word if said word overflow the board', () => {
        const finalBoardRowChars = ['A', 'B', 'C', 'D', 'E'];
        const beginPos = 11;
        const lettersToPlace: Letter[] = [];
        game.board.grid[11][0].letterObject.char = finalBoardRowChars[0];
        game.board.grid[12][0].letterObject.char = finalBoardRowChars[1];
        game.board.grid[13][0].letterObject.char = finalBoardRowChars[2];

        for (let i = 0; i < finalBoardRowChars.length; i++) {
            currentPlayer.letterRack[i % LetterBag.playerLetterCount].char = finalBoardRowChars[i];
            lettersToPlace.push({ char: finalBoardRowChars[i], value: 1 });
        }

        const placement: PlacementSetting = { direction: 'h', x: beginPos, y: beginPos };
        const action = new PlaceLetter(currentPlayer, lettersToPlace, placement);

        expect(service.validateAction(action, game)).not.toBeTruthy();

        expect(game.board.grid[14][0].letterObject.char).toBe(' ');
    });
    /// ////////////////// ///
});

/*
    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    private simulatePlayerInput(g: Game) {
        const fakeLetter = { char: 'A', value: 1 };
        g.getActivePlayer().letterRack[0] = fakeLetter;
        const exchangeLetterAction = new ExchangeLetter(g.getActivePlayer(), [fakeLetter]);
        const passTurnAction = new PassTurn(g.getActivePlayer());
        if (this.getRandomInt(2) === 1) {
            console.log('exchangeLetterAction ', exchangeLetterAction.id);
            g.avs.validateAction(exchangeLetterAction, g);
        } else {
            console.log('passTurnAction ', exchangeLetterAction.id);
            g.avs.validateAction(passTurnAction, g);
        }
    }

            setTimeout(() => {
                this.simulatePlayerInput(this);
            }, 2500);
*/
