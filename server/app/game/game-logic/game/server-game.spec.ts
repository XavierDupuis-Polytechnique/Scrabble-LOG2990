/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { ExchangeLetter } from '@app/game/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game/game-logic/actions/pass-turn';
import { RACK_LETTER_COUNT } from '@app/game/game-logic/constants';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { EndOfGame, EndOfGameReason } from '@app/game/game-logic/interface/end-of-game.interface';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';
import { Subject } from 'rxjs';
import { spy } from 'sinon';

const TIME_PER_TURN = 10;

describe('ServerGame', () => {
    let game: ServerGame;
    let p1: Player;
    let p2: Player;
    const randomBonus = false;
    const gameToken = 'defaultToken';
    const timerController = createSinonStubInstance<TimerController>(TimerController);
    const pointCalculator = createSinonStubInstance<PointCalculatorService>(PointCalculatorService);
    const gameCompiler = createSinonStubInstance<GameCompiler>(GameCompiler);
    const messagesService = createSinonStubInstance<SystemMessagesService>(SystemMessagesService);
    const newGameStateSubject = new Subject<GameStateToken>();
    const endGameSubject = new Subject<EndOfGame>();

    beforeEach(() => {
        game = new ServerGame(
            timerController,
            randomBonus,
            TIME_PER_TURN,
            gameToken,
            pointCalculator,
            gameCompiler,
            messagesService,
            newGameStateSubject,
            endGameSubject,
        );
        p1 = new Player('Tim');
        p2 = new Player('Paul');
        game.players = [p1, p2];
    });

    it('should create instance', () => {
        expect(game).to.be.instanceOf(ServerGame);
    });

    it('#start should throw error when no players', () => {
        game.players = [];
        expect(() => {
            game.start();
        }).to.Throw();
    });

    it('should draw 7 letter @ start', () => {
        game.start();
        expect(p1.letterRack.length).to.be.equal(RACK_LETTER_COUNT);
        expect(p2.letterRack.length).to.be.equal(RACK_LETTER_COUNT);
    });

    it('should end game when letter bag is empty and one player rack is empty', () => {
        game.start();
        game.letterBag.gameLetters = [];
        p1.letterRack = [];
        expect(game.isEndOfGame()).to.be.equal(true);
    });

    it('should not end game when letter bag is empty and one player rack not empty', () => {
        game.start();
        game.letterBag.gameLetters = [];
        p1.letterRack = [{ char: 'J', value: 1 }];
        expect(game.isEndOfGame()).to.be.equal(false);
    });

    it('on game end send message to system', () => {
        game.start();
        game.letterBag.gameLetters = [];
        p1.letterRack = [];
        expect(game.isEndOfGame()).to.be.equal(true);
        if (game.isEndOfGame()) {
            game['onEndOfGame'](EndOfGameReason.GameEnded);
        }
    });

    it('should end game when pass are called a number of time (6) ', () => {
        game.start();
        game.consecutivePass = 6;
        expect(game.isEndOfGame()).to.be.equal(true);
    });

    it('action should call onEndOfGame if it is end of game', () => {
        game.start();
        game.consecutivePass = 5;
        const passAction = new PassTurn(game.getActivePlayer());
        game.getActivePlayer().play(passAction);
        const isEndGame = game.isEndOfGame();
        expect(isEndGame).to.be.equal(true);
    });

    it('next player should return next player', () => {
        game.start();
        const currentPlayer = game.getActivePlayer();
        game['nextPlayer']();
        const nextPlayer = game.getActivePlayer();
        const isSamePlayer = currentPlayer === nextPlayer;
        expect(isSamePlayer).to.be.equal(false);
    });

    it('isEndOfGame should return false if not end of game', () => {
        game.start();
        const isEndOfGame = game.isEndOfGame();
        expect(isEndOfGame).to.be.equal(false);
    });

    it('if action different than pass, should reset pass counter', () => {
        game.consecutivePass = 3;
        const action = new ExchangeLetter(game.players[0], game.players[0].letterRack);
        action.execute(game);
        expect(game.consecutivePass).to.be.equal(0);
    });

    it('getWinner should return the right winner', () => {
        game.players[0].points = 5;
        const winners = game.getWinner();
        expect(winners.length).to.be.equal(1);
        expect(winners[0].name).to.be.equal('Tim');
    });

    it('getWinner should return both winner when same score', () => {
        game.players[0].points = 10;
        game.players[1].points = 10;
        const winners = game.getWinner();
        expect(winners.length).to.be.equal(2);
    });

    it('action from player should end his turn and change to next player', () => {
        game.start();
        const currentPlayer = game.getActivePlayer();
        const action = new PassTurn(currentPlayer);
        currentPlayer.play(action);
        const nextPlayer = game.getActivePlayer();
        const isSamePlayer = currentPlayer.name === nextPlayer.name;
        expect(isSamePlayer).to.be.equal(false);
    });

    it('should update the winnerByForfeitedIndex when a player forfeits', () => {
        game.forfeit(p1.name);
        expect(game.players[game.winnerByForfeitedIndex]).to.be.deep.equal(p2);
    });

    it('should get the correct winner when a player has forfeited', () => {
        game.forfeit(p1.name);
        expect(game.getWinner().length).to.be.equal(1);
        expect(game.getWinner()[0]).to.be.deep.equal(p2);
    });

    it('endOfTurn should return true and call onEndOfGame if the endReason is defined', () => {
        game.stop();
        expect(game.endReason).to.be.equal(EndOfGameReason.Other);
        const gameSpy = spy(game, 'onEndOfGame' as any);
        game['startTurn']();
        expect(gameSpy.called).to.be.equal(true);
    });

    it('forfeit should return reason forfeit and isEndOFgame should return false', () => {
        game.forfeit('blabla');
        expect(game.endReason).to.be.equal(EndOfGameReason.Forfeit);
        const result = game['isEndOfGame']();
        expect(result).to.be.equal(false);
    });

    it('endOfTurn should return and call onEndOfGame if the endReason is defined', () => {
        const action = new PassTurn(p1);
        const actionSpy = spy(action, 'execute');
        game.start();
        game.consecutivePass = 6;
        game.endReason = EndOfGameReason.GameEnded;
        const gameSpy = spy(game, 'onEndOfGame' as any);
        game['endOfTurn'](action);
        expect(gameSpy.called).to.be.equal(true);
        expect(actionSpy.called).to.be.equal(false);
    });

    it('should call the onEndOfGame if the action passed to onEndOfTurn is undefined', () => {
        game.start();
        const gameSpy = spy(game, 'onEndOfGame' as any);
        game['endOfTurn'](undefined);
        expect(gameSpy.called).to.be.equal(true);
    });
});
