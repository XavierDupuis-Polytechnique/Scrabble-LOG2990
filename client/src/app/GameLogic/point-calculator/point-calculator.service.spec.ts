import { TestBed } from "@angular/core/testing";
import { BoardService } from "@app/services/board.service";
import { Direction } from "../actions/direction.enum";
import { PlaceLetter } from "../actions/place-letter";
import { Board } from "../game/board";
import { Game } from "../game/games/game";
import { Letter } from "../game/letter.interface";
import { Tile } from "../game/tile";
import { TimerService } from "../game/timer/timer.service";
import { Player } from "../player/player";
import { User } from "../player/user";
import { PointCalculatorService } from "./point-calculator.service";

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
    const listOfWord: Tile[][] = [];
    let word: Tile[];


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
        const action = new PlaceLetter(player2, 'bateaux', { x: 0, y: 0, direction: Direction.Horizontal });

        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        expect(servicePoints.calculatePointsOfWord(action, word)).toBe(totalPointsOfWord);
    });

    it('should calculate the correct points of a word with word multiplicator', () => {
        const totalPointsOfWord = 66;
        const action = new PlaceLetter(player2, 'bateaux', { x: 0, y: 0, direction: Direction.Horizontal });

        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 2 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 3 },
        ];
        expect(servicePoints.calculatePointsOfWord(action, word)).toBe(totalPointsOfWord);
    });

    // During game
    it('should calculate the correct points of a word when placing all the players letters if >=7', () => {
        const totalPointsOfWord = 101;
        const bateaux = 'bateaux';
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 1, wordMultiplicator: 3 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'X', value: 8 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        listOfWord.push(word);

        const timePerTurn = 30;
        const game = new MockGame(timePerTurn, timer, servicePoints, boardService);
        game.board.grid[0][0].letterObject = { char: 'B', value: 3 };
        game.board.grid[0][1].letterObject = { char: 'A', value: 1 };
        game.board.grid[0][2].letterObject = { char: 'T', value: 1 };
        game.board.grid[0][3].letterObject = { char: 'E', value: 1 };
        game.board.grid[0][4].letterObject = { char: 'A', value: 1 };
        game.board.grid[0][5].letterObject = { char: 'U', value: 1 };
        game.board.grid[0][6].letterObject = { char: 'X', value: 8 };
        player2.letterRack = emptyRack;
        const action = new PlaceLetter(player2, bateaux, { x: 0, y: 0, direction: Direction.Horizontal });
        expect(servicePoints.placeLetterPointsCalculation(action, listOfWord, boardService)).toBe(totalPointsOfWord);
    });

    it('should calculate the correct points of a word when placing a word with a letter whose multiplicator has been used', () => {
        const totalPointsOfWord = 16; //TODO:A calculer

        const timePerTurn = 30;
        const game = new MockGame(timePerTurn, timer, servicePoints, boardService);
        let grid = game.board.grid;

        grid[0][0].letterObject = { char: 'B', value: 3 };
        grid[0][1].letterObject = { char: 'A', value: 1 };
        grid[0][2].letterObject = { char: 'T', value: 1 };

        // Letters
        const wordBat = [{ letterObject: grid[0][0].letterObject, letterMultiplicator: grid[0][0].letterMultiplicator, wordMultiplicator: grid[0][0].wordMultiplicator },
        { letterObject: grid[0][1].letterObject, letterMultiplicator: grid[0][1].letterMultiplicator, wordMultiplicator: grid[0][1].wordMultiplicator },
        { letterObject: grid[0][2].letterObject, letterMultiplicator: grid[0][2].letterMultiplicator, wordMultiplicator: grid[0][2].wordMultiplicator }];

        listOfWord.push(wordBat);
        const action1 = new PlaceLetter(player2, 'bat', { x: 0, y: 0, direction: Direction.Horizontal });
        servicePoints.placeLetterPointsCalculation(action1, listOfWord, boardService);
        console.log("POINTS PLAYER2: ", player2.points); // should be 15
        const wordBateaux = [
            { letterObject: grid[0][0].letterObject, letterMultiplicator: grid[0][0].letterMultiplicator, wordMultiplicator: grid[0][0].wordMultiplicator },
            { letterObject: grid[0][1].letterObject, letterMultiplicator: grid[0][1].letterMultiplicator, wordMultiplicator: grid[0][1].wordMultiplicator },
            { letterObject: grid[0][2].letterObject, letterMultiplicator: grid[0][2].letterMultiplicator, wordMultiplicator: grid[0][2].wordMultiplicator },
            { letterObject: grid[0][3].letterObject, letterMultiplicator: grid[0][3].letterMultiplicator, wordMultiplicator: grid[0][3].wordMultiplicator },
            { letterObject: grid[0][4].letterObject, letterMultiplicator: grid[0][4].letterMultiplicator, wordMultiplicator: grid[0][4].wordMultiplicator },
            { letterObject: grid[0][5].letterObject, letterMultiplicator: grid[0][5].letterMultiplicator, wordMultiplicator: grid[0][5].wordMultiplicator },
            { letterObject: grid[0][6].letterObject, letterMultiplicator: grid[0][6].letterMultiplicator, wordMultiplicator: grid[0][6].wordMultiplicator },
        ];
        listOfWord.pop();
        listOfWord.push(wordBateaux);
        grid[0][3].letterObject = { char: 'E', value: 1 };
        grid[0][4].letterObject = { char: 'A', value: 1 };
        grid[0][5].letterObject = { char: 'U', value: 1 };
        grid[0][6].letterObject = { char: 'X', value: 8 };

        const action = new PlaceLetter(player2, 'bateaux', { x: 0, y: 0, direction: Direction.Horizontal });
        servicePoints.placeLetterPointsCalculation(action, listOfWord, boardService);
        console.log("POINTS PLAYER2: ", player2.points); // should be 17 +50?
        expect(player2.points).toBe(totalPointsOfWord);
    });

    it('should calculate the correct points when more than one word was made', () => {
        // The word "AT" is on the board, the player adds "BAKE"
        const timePerTurn = 30;
        const game = new MockGame(timePerTurn, timer, servicePoints, boardService);
        let grid = game.board.grid;

        grid[3][0].letterObject = { char: 'A', value: 1 };
        grid[4][0].letterObject = { char: 'T', value: 1 };

        const totalPointsOfPlayer2 = 21;

        player1.points = 0;
        player2.points = 0;
        player1.letterRack = [{ char: 'E', value: 1 }];
        player2.letterRack = [{ char: 'A', value: 1 }];

        const wordAt = [{ letterObject: grid[3][0].letterObject, letterMultiplicator: grid[3][0].letterMultiplicator, wordMultiplicator: grid[3][0].wordMultiplicator },
        { letterObject: grid[4][0].letterObject, letterMultiplicator: grid[4][0].letterMultiplicator, wordMultiplicator: grid[4][0].wordMultiplicator }];
        listOfWord.push(wordAt);
        const oldAction = new PlaceLetter(player1, 'at', { x: 0, y: 3, direction: Direction.Vertical });
        servicePoints.placeLetterPointsCalculation(oldAction, listOfWord, boardService);

        listOfWord.pop();
        grid[2][0].letterObject = { char: 'B', value: 3 };
        grid[2][1].letterObject = { char: 'A', value: 1 };
        grid[2][2].letterObject = { char: 'K', value: 5 };
        grid[2][3].letterObject = { char: 'E', value: 1 };
        const wordBat = [
            { letterObject: grid[2][0].letterObject, letterMultiplicator: grid[2][0].letterMultiplicator, wordMultiplicator: grid[2][0].wordMultiplicator },
            { letterObject: grid[3][0].letterObject, letterMultiplicator: grid[3][0].letterMultiplicator, wordMultiplicator: grid[3][0].wordMultiplicator },
            { letterObject: grid[4][0].letterObject, letterMultiplicator: grid[4][0].letterMultiplicator, wordMultiplicator: grid[4][0].wordMultiplicator },
        ];
        const wordBake = [
            { letterObject: grid[2][0].letterObject, letterMultiplicator: grid[2][0].letterMultiplicator, wordMultiplicator: grid[2][0].wordMultiplicator },
            { letterObject: grid[2][1].letterObject, letterMultiplicator: grid[2][1].letterMultiplicator, wordMultiplicator: grid[2][1].wordMultiplicator },
            { letterObject: grid[2][2].letterObject, letterMultiplicator: grid[2][2].letterMultiplicator, wordMultiplicator: grid[2][2].wordMultiplicator },
            { letterObject: grid[2][3].letterObject, letterMultiplicator: grid[2][3].letterMultiplicator, wordMultiplicator: grid[2][3].wordMultiplicator },
        ];
        listOfWord.push(wordBat);
        listOfWord.push(wordBake);
        const action = new PlaceLetter(player2, 'bake', { x: 0, y: 2, direction: Direction.Horizontal });
        expect(servicePoints.placeLetterPointsCalculation(action, listOfWord, boardService)).toBe(totalPointsOfPlayer2);
    });

    // // End of Game
    // it('should not calculate bonus when player place all letter if rack was not full (on end of game)', () => {
    //     const totalPointsOfWord = 8;

    //     const timeTurn = 30;
    //     const game = new MockGame(timeTurn, timer, servicePoints, boardService);
    //     game.board.grid[5][0].letterObject = { char: 'C', value: 3 };
    //     game.board.grid[5][1].letterObject = { char: 'E', value: 1 };
    //     game.board.grid[5][2].letterObject = { char: 'T', value: 1 };
    //     game.consecutivePass = 0;
    //     word = [
    //         { letterObject: { char: 'C', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
    //         { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //         { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //     ];
    //     listOfWord.pop();
    //     listOfWord.push(word);
    //     const action = new PlaceLetter(player2, 'cet', { x: 10, y: 0, direction: Direction.Vertical });
    //     const initialPointPlayer1 = 150;
    //     const initialPointPlayer2 = 50;

    //     game.activePlayer.points = initialPointPlayer1;
    //     game.otherPlayer.points = initialPointPlayer2;
    //     game.activePlayer.letterRack = emptyRack;
    //     game.otherPlayer.letterRack = rack;

    //     expect(servicePoints.placeLetterPointsCalculation(action, listOfWord)).toBe(totalPointsOfWord);

    //     expect(game.activePlayer.points).toBe(initialPointPlayer1 + totalPointsOfWord);

    //     const activePlayerEOGamePoints = initialPointPlayer1 + totalPointsOfWord + servicePoints.calculatePointsOfRack(game.otherPlayer);
    //     const otherPlayerEOGamePoints = initialPointPlayer2 - servicePoints.calculatePointsOfRack(game.otherPlayer);

    //     servicePoints.endOfGamePointdeduction(game as Game);
    //     expect(game.activePlayer.points).toBe(activePlayerEOGamePoints);
    //     expect(game.otherPlayer.points).toBe(otherPlayerEOGamePoints);
    // });

    // it('should calculate the correct points at the end of game after 6 consecutive pass', () => {
    //     const totalPointsActivePlayer = 133;
    //     const totalPointsOtherPlayer = 45;

    //     const threeLetterRack = [
    //         { char: 'C', value: 3 },
    //         { char: 'E', value: 1 },
    //         { char: 'T', value: 1 },
    //     ];
    //     const timeTurn = 30;
    //     const game = new MockGame(timeTurn, timer, servicePoints, boardService);
    //     game.activePlayer.points = 150;
    //     game.otherPlayer.points = 50;
    //     game.activePlayer.letterRack = rack;
    //     game.otherPlayer.letterRack = threeLetterRack;
    //     servicePoints.endOfGamePointdeduction(game as Game);

    //     expect(game.activePlayer.points).toBe(totalPointsActivePlayer);
    //     expect(game.otherPlayer.points).toBe(totalPointsOtherPlayer);
    // });
});
