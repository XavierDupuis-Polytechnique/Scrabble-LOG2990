import { TestBed } from '@angular/core/testing';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { EasyBot } from '@app/GameLogic/player/easy-bot';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';

describe('ActionValidatorService', () => {
    let service: ActionValidatorService;
    let game: Game;
    let p1User: User;
    let p2Bot: EasyBot;
    let currentPlayer: Player;
    let lettersToExchange: Letter[];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ActionValidatorService);
        game = new Game(30000, new TimerService(), new PointCalculatorService(), new BoardService());
        p1User = new User('testUser');
        p2Bot = new EasyBot('testUser');
        game.players.push(p1User);
        game.players.push(p2Bot);
        game.start();
        currentPlayer = game.getActivePlayer();
    });

    it('should be referenced', () => {
        expect(new ActionValidatorService()).toEqual(service);
    });

    /// TURN TESTS ///
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

    /// EXCHANGE LETTER TESTS ///
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

    it('should invalidate an invalid ExchangeLetter because a player cannot exchange more of the same letter', () => {
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
