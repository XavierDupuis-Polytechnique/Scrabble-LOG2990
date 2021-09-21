import { TestBed } from '@angular/core/testing';
import { TimerService } from '@app/GameLogic//game/timer/timer.service';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Board } from '@app/GameLogic/game/board';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';

const MAX_CONSECUTIVE_PASS = 6;

class MockGame extends Game {
    static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
    activePlayer: Player = new User('ActivePlayer');
    otherPlayer: Player = new User('otherPlayer');
    players: Player[];
    consecutivePass: number = MAX_CONSECUTIVE_PASS;
    board: Board = new Board();

    constructor(time: number, timerService: TimerService, pointCalculatorService: PointCalculatorService, boardService: BoardService) {
        super(time, timerService, pointCalculatorService, boardService);
        this.players = [this.activePlayer, this.otherPlayer];
    }
    getActivePlayer() {
        return this.activePlayer;
    }
}
describe('PointCalculatorService', () => {
    let servicePoints: PointCalculatorService;
    let timer: TimerService;
    let boardService: BoardService;

    const player1: Player = new User('Tim');
    const player2: Player = new User('Max');

    const rack: Letter[] = [
        { char: 'A', value: 1 },
        { char: 'B', value: 3 },
        { char: 'C', value: 3 },
        { char: 'D', value: 3 },
        { char: 'E', value: 2 },
        { char: 'F', value: 1 },
        { char: 'F', value: 4 },
    ];

    const emptyRack: Letter[] = [];
    let word: Tile[];
    const listOfWord: Tile[][] = [];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        servicePoints = TestBed.inject(PointCalculatorService);
        timer = TestBed.inject(TimerService);
        boardService = TestBed.inject(BoardService);
        while (listOfWord.length > 0) {
            listOfWord.pop();
        }
    });

    it('should be created', () => {
        expect(servicePoints).toBeTruthy();
    });

    // Rack
    it('should calculate the correct points of players full rack', () => {
        player1.letterRack = rack;
        let totalPointsInRack = 0;
        for (const letter of rack) {
            totalPointsInRack += letter.value;
        }
        expect(servicePoints.calculatePointsOfRack(player1)).toBe(totalPointsInRack);
    });

    it('should calculate the correct points of players empty rack', () => {
        const totalPointsInRack = 0;
        player2.letterRack = emptyRack;
        expect(servicePoints.calculatePointsOfRack(player2)).toBe(totalPointsInRack);
    });

    // Word
    it('should calculate the correct points of a word with letter multiplicator', () => {
        const totalPointsOfWord = 11;
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        expect(servicePoints.calculatePointsOfWord(word)).toBe(totalPointsOfWord);
    });

    it('should calculate the correct points of a word with word multiplicator', () => {
        const totalPointsOfWord = 66;
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 2 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 3 },
        ];
        expect(servicePoints.calculatePointsOfWord(word)).toBe(totalPointsOfWord);
    });
    // During game
    it('should calculate the correct points of a word when placing all the players letters if >=7', () => {
        const totalPointsOfWord = 110;
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 3 },
            { letterObject: { char: 'X', value: 8 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        listOfWord.push(word);
        const action = new PlaceLetter(player2, 'bateaux', { x: 6, y: 6, direction: 'h' });
        player2.letterRack = emptyRack;
        expect(servicePoints.placeLetterPointsCalculation(player2, action, listOfWord)).toBe(totalPointsOfWord);
    });

    it('should calculate the correct points of a word when placing a word with a letter whose multiplicator has been used', () => {
        const totalPointsOfWord = 16;
        // Letters
        const letterA = new Tile(2, 1);
        letterA.letterObject = { char: 'A', value: 1 };
        const letterB = new Tile(2, 1);
        letterB.letterObject = { char: 'B', value: 3 };
        const letterT = new Tile(1, 1);
        letterT.letterObject = { char: 'T', value: 1 };

        player2.letterRack = [{ char: 'A', value: 1 }];

        const wordBat = [letterB, letterA, letterT];
        const wordBateaux = [
            letterB,
            letterA,
            letterT,
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'X', value: 8 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        listOfWord.push(wordBat);
        const action1 = new PlaceLetter(player2, 'bat', { x: 6, y: 6, direction: 'h' });
        servicePoints.placeLetterPointsCalculation(player2, action1, listOfWord);

        listOfWord.pop();
        listOfWord.push(wordBateaux);
        const action = new PlaceLetter(player2, 'bateau', { x: 6, y: 9, direction: 'h' });
        expect(servicePoints.placeLetterPointsCalculation(player2, action, listOfWord)).toBe(totalPointsOfWord);
    });

    it('should calculate the correct points when more than one word was made', () => {
        // The word "AT" is on the board, the player adds "BAKE"
        const totalPointsOfPlayer2 = 21;
        const letterA = new Tile(2, 1);
        letterA.letterObject = { char: 'A', value: 1 };

        player1.points = 0;
        player2.points = 0;
        player1.letterRack = [{ char: 'E', value: 1 }];
        player2.letterRack = [{ char: 'A', value: 1 }];

        const wordAt = [letterA, { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 }];
        listOfWord.push(wordAt);
        const oldAction = new PlaceLetter(player1, 'at', { x: 6, y: 6, direction: 'v' });
        servicePoints.placeLetterPointsCalculation(player1, oldAction, listOfWord);
        listOfWord.pop();

        const wordBat = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            letterA,
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        const wordBake = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'K', value: 5 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        listOfWord.push(wordBat);
        listOfWord.push(wordBake);
        const action = new PlaceLetter(player2, 'bake', { x: 6, y: 5, direction: 'h' });
        expect(servicePoints.placeLetterPointsCalculation(player2, action, listOfWord)).toBe(totalPointsOfPlayer2);
    });

    // End of Game
    it('should not calculate bonus when player place all letter if rack was not full (on end of game)', () => {
        const totalPointsOfWord = 8;
        const timeTurn = 30;
        const game = new MockGame(timeTurn, timer, servicePoints, boardService);
        game.consecutivePass = 0;
        word = [
            { letterObject: { char: 'C', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        listOfWord.pop();
        listOfWord.push(word);
        const action = new PlaceLetter(player2, 'threeLetterRack', { x: 6, y: 6, direction: 'h' });
        const initialPointPlayer1 = 150;
        const initialPointPlayer2 = 50;

        game.activePlayer.points = initialPointPlayer1;
        game.otherPlayer.points = initialPointPlayer2;
        game.activePlayer.letterRack = emptyRack;
        game.otherPlayer.letterRack = rack;

        expect(servicePoints.placeLetterPointsCalculation(game.activePlayer, action, listOfWord)).toBe(totalPointsOfWord);

        expect(game.activePlayer.points).toBe(initialPointPlayer1 + totalPointsOfWord);

        const activePlayerEOGamePoints = initialPointPlayer1 + totalPointsOfWord + servicePoints.calculatePointsOfRack(game.otherPlayer);
        const otherPlayerEOGamePoints = initialPointPlayer2 - servicePoints.calculatePointsOfRack(game.otherPlayer);

        servicePoints.endOfGamePointdeduction(game as Game);
        expect(game.activePlayer.points).toBe(activePlayerEOGamePoints);
        expect(game.otherPlayer.points).toBe(otherPlayerEOGamePoints);
    });

    it('should calculate the correct points at the end of game after 6 consecutive pass', () => {
        const totalPointsActivePlayer = 133;
        const totalPointsOtherPlayer = 45;

        const threeLetterRack = [
            { char: 'C', value: 3 },
            { char: 'E', value: 1 },
            { char: 'T', value: 1 },
        ];
        const timeTurn = 30;
        const game = new MockGame(timeTurn, timer, servicePoints, boardService);
        game.activePlayer.points = 150;
        game.otherPlayer.points = 50;
        game.activePlayer.letterRack = rack;
        game.otherPlayer.letterRack = threeLetterRack;
        servicePoints.endOfGamePointdeduction(game as Game);

        expect(game.activePlayer.points).toBe(totalPointsActivePlayer);
        expect(game.otherPlayer.points).toBe(totalPointsOtherPlayer);
    });
});
