import { TestBed } from '@angular/core/testing';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Board } from '@app/GameLogic/game/board';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { BoardService } from '@app/services/board.service';
import { PointCalculatorService } from './point-calculator.service';

const MAX_CONSECUTIVE_PASS = 6;
class MockGame extends Game {
    static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
    activePlayer: Player = new User('ActivePlayer');
    otherPlayer: Player = new User('otherPlayer');
    players: Player[];
    consecutivePass: number = MAX_CONSECUTIVE_PASS;
    board: Board;

    constructor(time: number, timerService: TimerService, pointCalculatorService: PointCalculatorService, boardService: BoardService) {
        super(time, timerService, pointCalculatorService, boardService);
        this.players = [this.activePlayer, this.otherPlayer];
        this.board = boardService.board;
    }
    getActivePlayer() {
        return this.activePlayer;
    }
}
describe('PointCalculatorService', () => {
    let servicePoints: PointCalculatorService;
    let timer: TimerService;
    let boardService: BoardService;
    let player1: Player;
    let player2: Player;

    const rack: Letter[] = [
        { char: 'A', value: 1 },
        { char: 'B', value: 3 },
        { char: 'C', value: 3 },
        { char: 'D', value: 2 },
        { char: 'E', value: 1 },
        { char: 'F', value: 4 },
        { char: 'G', value: 2 },
    ];
    const emptyRack: Letter[] = [];
    let listOfWord: Tile[][];
    let word: Tile[];
    const timePerTurn = 30;
    let game: MockGame;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        servicePoints = TestBed.inject(PointCalculatorService);
        timer = TestBed.inject(TimerService);
        boardService = TestBed.inject(BoardService);
        listOfWord = [];
        game = new MockGame(timePerTurn, timer, servicePoints, boardService);
        player1 = new User('Tim');
        player2 = new User('Max');
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
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'E', value: 1 },
            { char: 'A', value: 1 },
            { char: 'U', value: 1 },
            { char: 'X', value: 8 },
        ];
        action.execute(game);
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
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'E', value: 1 },
            { char: 'A', value: 1 },
            { char: 'U', value: 1 },
            { char: 'X', value: 8 },
        ];
        action.execute(game);
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

        game.board.grid[0][0].letterObject = { char: 'B', value: 3 };
        game.board.grid[0][1].letterObject = { char: 'A', value: 1 };
        game.board.grid[0][2].letterObject = { char: 'T', value: 1 };
        game.board.grid[0][3].letterObject = { char: 'E', value: 1 };
        game.board.grid[0][4].letterObject = { char: 'A', value: 1 };
        game.board.grid[0][5].letterObject = { char: 'U', value: 1 };
        game.board.grid[0][6].letterObject = { char: 'X', value: 8 };
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'E', value: 1 },
            { char: 'A', value: 1 },
            { char: 'U', value: 1 },
            { char: 'X', value: 8 },
        ];
        const action = new PlaceLetter(player2, bateaux, { x: 0, y: 0, direction: Direction.Horizontal });

        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
        ];
        servicePoints.placeLetterPointsCalculation(action, listOfWord, boardService);

        expect(player2.points).toBe(totalPointsOfWord);
    });

    it('should calculate the correct points of a word when placing a word with a letter whose multiplicator has been used', () => {
        const totalPointsOfWordPlayer1 = 15;
        const totalPointsOfWordPlayer2 = 17;
        const grid = game.board.grid;

        // Letters
        const wordBat = [grid[0][0], grid[0][1], grid[0][2]];
        player1.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'Z', value: 10 },
            { char: 'M', value: 3 },
            { char: 'I', value: 1 },
            { char: 'L', value: 1 },
        ];
        game.board.grid[0][0].letterObject = { char: 'B', value: 3 };
        game.board.grid[0][1].letterObject = { char: 'A', value: 1 };
        game.board.grid[0][2].letterObject = { char: 'T', value: 1 };

        listOfWord.push(wordBat);
        const action1 = new PlaceLetter(player1, 'bat', { x: 0, y: 0, direction: Direction.Horizontal });
        action1.execute(game);
        action1.affectedCoords = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
        ];
        servicePoints.placeLetterPointsCalculation(action1, listOfWord, boardService);
        expect(player2.points).toBe(totalPointsOfWordPlayer1);

        const wordBateaux = [grid[0][0], grid[0][1], grid[0][2], grid[0][3], grid[0][4], grid[0][5], grid[0][6]];
        listOfWord = [];
        listOfWord.push(wordBateaux);

        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'E', value: 1 },
            { char: 'A', value: 1 },
            { char: 'U', value: 1 },
            { char: 'X', value: 8 },
        ];
        game.board.grid[0][3].letterObject = { char: 'E', value: 1 };
        game.board.grid[0][4].letterObject = { char: 'A', value: 1 };
        game.board.grid[0][5].letterObject = { char: 'U', value: 1 };
        game.board.grid[0][6].letterObject = { char: 'X', value: 8 };

        const action2 = new PlaceLetter(player2, 'bateaux', { x: 0, y: 0, direction: Direction.Horizontal });
        action2.execute(game);
        action1.affectedCoords = [
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
        ];

        servicePoints.placeLetterPointsCalculation(action2, listOfWord, boardService);
        const points = player2.points;
        expect(points).toBe(totalPointsOfWordPlayer2);
    });

    it('should calculate the correct points when more than one word was made', () => {
        // The word "AT" is on the board, the player adds "BAKE"
        const grid = game.board.grid;

        const totalPointsOfPlayer1 = 3;
        player1.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'O', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
        ];
        const wordAt = [grid[3][0], grid[4][0]];
        listOfWord.push(wordAt);
        const oldAction = new PlaceLetter(player1, 'at', { x: 0, y: 3, direction: Direction.Vertical });
        oldAction.execute(game);
        servicePoints.placeLetterPointsCalculation(oldAction, listOfWord, boardService); // 3
        expect(player1.points).toBe(totalPointsOfPlayer1);

        const totalPointsOfPlayer2 = 25;

        const wordBat = [grid[2][0], grid[3][0], grid[4][0]];
        const wordBake = [grid[2][0], grid[2][1], grid[2][2], grid[2][3]];
        listOfWord = [];
        listOfWord.push(wordBat);
        listOfWord.push(wordBake);

        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'K', value: 5 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
        ];
        const action = new PlaceLetter(player2, 'bake', { x: 0, y: 2, direction: Direction.Horizontal });
        action.execute(game);
        servicePoints.placeLetterPointsCalculation(action, listOfWord, boardService);
        expect(player2.points).toBe(totalPointsOfPlayer2);
    });

    // End of Game
    it('should not calculate bonus when player place all letter if rack was not full (on end of game)', () => {
        const totalPointsOfWord = 8;

        game.consecutivePass = 0;
        word = [
            { letterObject: { char: 'C', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];

        player1.letterRack = [
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'C', value: 3 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'U', value: 1 },
            { char: 'N', value: 1 },
        ];

        listOfWord.push(word);
        const action = new PlaceLetter(player1, 'cet', { x: 5, y: 0, direction: Direction.Vertical });
        action.affectedCoords = [
            { x: 5, y: 0 },
            { x: 5, y: 1 },
            { x: 5, y: 2 },
        ];
        const initialPointPlayer1 = 150;
        const initialPointPlayer2 = 50;
        player1.points = initialPointPlayer1;
        player2.points = initialPointPlayer2;

        game.activePlayer = player1;
        game.otherPlayer = player2;

        expect(servicePoints.placeLetterPointsCalculation(action, listOfWord, boardService)).toBe(totalPointsOfWord);

        expect(game.activePlayer.points).toBe(initialPointPlayer1 + totalPointsOfWord);

        const activePlayerEOGamePoints = initialPointPlayer1 + totalPointsOfWord + servicePoints.calculatePointsOfRack(game.otherPlayer);
        const otherPlayerEOGamePoints = initialPointPlayer2 - servicePoints.calculatePointsOfRack(game.otherPlayer);

        servicePoints.endOfGamePointdeduction(game as Game);
        expect(game.activePlayer.points).toBe(activePlayerEOGamePoints);
        expect(game.otherPlayer.points).toBe(otherPlayerEOGamePoints);
    });

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
