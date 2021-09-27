/* eslint-disable max-lines */
/* eslint-disable max-classes-per-file */
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
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { BoardService } from '@app/services/board.service';
import { PointCalculatorService } from './point-calculator.service';

const MAX_CONSECUTIVE_PASS = 6;
const MAX_LETTER_IN_RACK = 7;
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

class MockPlaceLetter extends PlaceLetter {
    execute(game: Game) {
        return game;
    }
}

describe('PointCalculatorService', () => {
    let servicePoints: PointCalculatorService;
    let timer: TimerService;
    let boardService: BoardService;
    let player1: Player;
    let player2: Player;
    let action: MockPlaceLetter;
    let game: MockGame;
    let grid: Tile[][];
    const timePerTurn = 30;
    const emptyRack: Letter[] = [];
    const rack: Letter[] = [
        { char: 'A', value: 1 },
        { char: 'B', value: 3 },
        { char: 'C', value: 3 },
        { char: 'D', value: 2 },
        { char: 'E', value: 1 },
        { char: 'F', value: 4 },
        { char: 'G', value: 2 },
    ];
    let listOfWord: Tile[][];
    let word: Tile[];
    let wordSearcher: WordSearcher;
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [TimerService, BoardService, PointCalculatorService, WordSearcher] });
        timer = TestBed.inject(TimerService);
        boardService = TestBed.inject(BoardService);
        servicePoints = TestBed.inject(PointCalculatorService);
        wordSearcher = TestBed.inject(WordSearcher);
        game = new MockGame(timePerTurn, timer, servicePoints, boardService);
        player1 = new User('Tim');
        player2 = new User('Max');
        listOfWord = [];
        grid = game.board.grid;
    });

    it('should be created', () => {
        expect(servicePoints).toBeTruthy();
    });

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

    it('should calculate the correct points of a word with letter multiplicator', () => {
        const totalPointsOfWord = 11;
        action = new MockPlaceLetter(player2, 'bateaux', { x: 0, y: 0, direction: Direction.Horizontal }, servicePoints, wordSearcher);
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
        expect(servicePoints.calculatePointsOfWord(word)).toBe(totalPointsOfWord);
    });

    it('should calculate the correct points of a word with word multiplicator', () => {
        const totalPointsOfWord = 66;
        action = new MockPlaceLetter(player2, 'bateaux', { x: 0, y: 0, direction: Direction.Horizontal }, servicePoints, wordSearcher);
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
        expect(servicePoints.calculatePointsOfWord(word)).toBe(totalPointsOfWord);
    });

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
        grid[0][0].letterObject = { char: 'B', value: 3 };
        grid[0][1].letterObject = { char: 'A', value: 1 };
        grid[0][2].letterObject = { char: 'T', value: 1 };
        grid[0][3].letterObject = { char: 'E', value: 1 };
        grid[0][4].letterObject = { char: 'A', value: 1 };
        grid[0][5].letterObject = { char: 'U', value: 1 };
        grid[0][6].letterObject = { char: 'X', value: 8 };
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'E', value: 1 },
            { char: 'A', value: 1 },
            { char: 'U', value: 1 },
            { char: 'X', value: 8 },
        ];
        action = new MockPlaceLetter(player2, bateaux, { x: 0, y: 0, direction: Direction.Horizontal }, servicePoints, wordSearcher);
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
        servicePoints.placeLetterCalculation(action, listOfWord);
        const estimation = servicePoints.testPlaceLetterCalculation(MAX_LETTER_IN_RACK, listOfWord);
        expect(estimation.isBingo).toBe(true);
        expect(estimation.totalPoints).toBe(totalPointsOfWord);
        expect(player2.points).toBe(totalPointsOfWord);
    });

    it('should calculate the correct points of a word when placing a word with a letter whose multiplicator has been used', () => {
        const totalPointsOfWordPlayer1 = 15;
        const totalPointsOfWordPlayer2 = 17;
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
        grid[0][0].letterObject = { char: 'B', value: 3 };
        grid[0][1].letterObject = { char: 'A', value: 1 };
        grid[0][2].letterObject = { char: 'T', value: 1 };
        listOfWord.push(wordBat);
        action = new MockPlaceLetter(player1, 'bat', { x: 0, y: 0, direction: Direction.Horizontal }, servicePoints, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
        ];
        servicePoints.placeLetterCalculation(action, listOfWord);
        expect(player1.points).toBe(totalPointsOfWordPlayer1);

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
        grid[0][3].letterObject = { char: 'E', value: 1 };
        grid[0][4].letterObject = { char: 'A', value: 1 };
        grid[0][5].letterObject = { char: 'U', value: 1 };
        grid[0][6].letterObject = { char: 'X', value: 8 };
        action = new MockPlaceLetter(player2, 'bateaux', { x: 0, y: 0, direction: Direction.Horizontal }, servicePoints, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
        ];
        servicePoints.placeLetterCalculation(action, listOfWord);
        const points = player2.points;
        expect(points).toBe(totalPointsOfWordPlayer2);
    });

    it('should calculate the correct points when more than one word was made', () => {
        const totalPointsOfPlayer1 = 3;
        const totalPointsOfPlayer2 = 25;
        player1.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'O', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
        ];
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'K', value: 5 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
        ];
        grid[3][0].letterObject = { char: 'A', value: 1 };
        grid[4][0].letterObject = { char: 'T', value: 1 };
        const wordAt = [grid[3][0], grid[4][0]];
        listOfWord.push(wordAt);
        action = new MockPlaceLetter(player1, 'at', { x: 0, y: 3, direction: Direction.Vertical }, servicePoints, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 3 },
            { x: 0, y: 4 },
        ];
        servicePoints.placeLetterCalculation(action, listOfWord);
        expect(player1.points).toBe(totalPointsOfPlayer1);
        listOfWord = [];
        grid[2][0].letterObject = { char: 'B', value: 3 };
        grid[2][1].letterObject = { char: 'A', value: 1 };
        grid[2][2].letterObject = { char: 'K', value: 5 };
        grid[2][3].letterObject = { char: 'E', value: 1 };
        const wordBat = [grid[2][0], grid[3][0], grid[4][0]];
        const wordBake = [grid[2][0], grid[2][1], grid[2][2], grid[2][3]];
        const pointBat = 5;
        const pointBake = 20;
        listOfWord.push(wordBat);
        listOfWord.push(wordBake);
        action = new MockPlaceLetter(player2, 'bake', { x: 0, y: 2, direction: Direction.Horizontal }, servicePoints, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
        ];
        const letterToPlace = MAX_LETTER_IN_RACK - wordBake.length;
        const estimation = servicePoints.testPlaceLetterCalculation(letterToPlace, listOfWord);
        expect(estimation.wordsPoints[0].points).toBe(pointBat);
        expect(estimation.wordsPoints[1].points).toBe(pointBake);
        servicePoints.placeLetterCalculation(action, listOfWord);
        expect(player2.points).toBe(totalPointsOfPlayer2);
    });

    it('should estimate the correct points of every word made', () => {
        player1.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'O', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
        ];
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'K', value: 5 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
        ];
        grid[3][0].letterObject = { char: 'A', value: 1 };
        grid[4][0].letterObject = { char: 'T', value: 1 };
        const wordAt = [grid[3][0], grid[4][0]];
        listOfWord.push(wordAt);
        action = new MockPlaceLetter(player1, 'at', { x: 0, y: 3, direction: Direction.Vertical }, servicePoints, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 3 },
            { x: 0, y: 4 },
        ];
        servicePoints.placeLetterCalculation(action, listOfWord);
        listOfWord = [];

        grid[2][0].letterObject = { char: 'B', value: 3 };
        grid[2][1].letterObject = { char: 'A', value: 1 };
        grid[2][2].letterObject = { char: 'K', value: 5 };
        grid[2][3].letterObject = { char: 'E', value: 1 };
        const wordBat = [grid[2][0], grid[3][0], grid[4][0]];
        const wordBake = [grid[2][0], grid[2][1], grid[2][2], grid[2][3]];
        const pointBat = 5;
        const pointBake = 20;
        listOfWord.push(wordBat);
        listOfWord.push(wordBake);
        action = new MockPlaceLetter(player2, 'bake', { x: 0, y: 2, direction: Direction.Horizontal }, servicePoints, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
        ];
        const letterToPlace = MAX_LETTER_IN_RACK - wordBake.length;
        const estimation = servicePoints.testPlaceLetterCalculation(letterToPlace, listOfWord);
        expect(estimation.wordsPoints[0].points).toBe(pointBat);
        expect(estimation.wordsPoints[1].points).toBe(pointBake);
    });

    it('should not calculate bonus when player place all letter if rack was not full (on end of game)', () => {
        const totalPointsOfWord = 7;
        const initialPointPlayer1 = 150;
        const initialPointPlayer2 = 50;
        player1.points = initialPointPlayer1;
        player2.points = initialPointPlayer2;
        game.consecutivePass = 0;
        grid[0][5].letterObject = { char: 'C', value: 3 };
        grid[1][5].letterObject = { char: 'E', value: 1 };
        grid[2][5].letterObject = { char: 'T', value: 1 };
        const wordCet = [grid[0][5], grid[1][5], grid[2][5]];
        listOfWord.push(wordCet);
        player1.letterRack = [
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'C', value: 3 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'U', value: 1 },
            { char: 'N', value: 1 },
        ];
        action = new MockPlaceLetter(player1, 'cet', { x: 5, y: 0, direction: Direction.Vertical }, servicePoints, wordSearcher);
        action.affectedCoords = [
            { x: 5, y: 0 },
            { x: 5, y: 1 },
            { x: 5, y: 2 },
        ];
        game.activePlayer = player1;
        game.otherPlayer = player2;
        expect(servicePoints.placeLetterCalculation(action, listOfWord)).toBe(totalPointsOfWord);
        expect(game.activePlayer.points).toBe(initialPointPlayer1 + totalPointsOfWord);
        const activePlayerEOGamePoints = initialPointPlayer1 + totalPointsOfWord + servicePoints.calculatePointsOfRack(game.otherPlayer);
        const otherPlayerEOGamePoints = initialPointPlayer2 - servicePoints.calculatePointsOfRack(game.otherPlayer);
        servicePoints.endOfGamePointDeduction(game as Game);
        expect(game.activePlayer.points).toBe(activePlayerEOGamePoints);
        expect(game.otherPlayer.points).toBe(otherPlayerEOGamePoints);
    });

    it('should calculate bonus when player place all letter if rack was full (on end of game)', () => {
        const totalPointsOfWord = 72;
        const initialPointPlayer1 = 150;
        const initialPointPlayer2 = 50;
        player1.points = initialPointPlayer1;
        player2.points = initialPointPlayer2;
        game.consecutivePass = 1;
        grid[0][4].letterObject = { char: 'P', value: 3 };
        grid[1][4].letterObject = { char: 'I', value: 1 };
        grid[2][4].letterObject = { char: 'M', value: 3 };
        grid[3][4].letterObject = { char: 'E', value: 1 };
        grid[4][4].letterObject = { char: 'N', value: 1 };
        grid[5][4].letterObject = { char: 'T', value: 1 };
        grid[6][4].letterObject = { char: 'S', value: 1 };
        const wordPiments = [grid[0][4], grid[1][4], grid[2][4], grid[3][4], grid[4][4], grid[5][4], grid[6][4]];
        listOfWord.push(wordPiments);
        player2.letterRack = [
            { char: 'P', value: 3 },
            { char: 'I', value: 1 },
            { char: 'M', value: 3 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'T', value: 1 },
            { char: 'S', value: 1 },
        ];
        action = new MockPlaceLetter(player2, 'piments', { x: 4, y: 0, direction: Direction.Vertical }, servicePoints, wordSearcher);
        action.affectedCoords = [
            { x: 4, y: 0 },
            { x: 4, y: 1 },
            { x: 4, y: 2 },
            { x: 4, y: 3 },
            { x: 4, y: 4 },
            { x: 4, y: 5 },
            { x: 4, y: 6 },
        ];
        game.activePlayer = player2;
        game.otherPlayer = player1;
        expect(servicePoints.placeLetterCalculation(action, listOfWord)).toBe(totalPointsOfWord);
        expect(player2.points).toBe(initialPointPlayer2 + totalPointsOfWord);
        const activePlayerEOGamePoints = initialPointPlayer2 + totalPointsOfWord + servicePoints.calculatePointsOfRack(game.otherPlayer);
        const otherPlayerEOGamePoints = initialPointPlayer1 - servicePoints.calculatePointsOfRack(game.otherPlayer);
        servicePoints.endOfGamePointDeduction(game as Game);
        expect(game.activePlayer.points).toBe(activePlayerEOGamePoints);
        expect(game.otherPlayer.points).toBe(otherPlayerEOGamePoints);
    });

    it('should calculate the correct points at the end of game after 6 consecutive pass', () => {
        const totalPointsActivePlayer = 84;
        const totalPointsOtherPlayer = 95;
        const threeLetterRack = [
            { char: 'C', value: 3 },
            { char: 'E', value: 1 },
            { char: 'T', value: 1 },
        ];
        const timeTurn = 30;
        game = new MockGame(timeTurn, timer, servicePoints, boardService);
        game.activePlayer.points = 100;
        game.otherPlayer.points = 100;
        game.activePlayer.letterRack = rack;
        game.otherPlayer.letterRack = threeLetterRack;
        servicePoints.endOfGamePointDeduction(game as Game);
        expect(game.activePlayer.points).toBe(totalPointsActivePlayer);
        expect(game.otherPlayer.points).toBe(totalPointsOtherPlayer);
    });
});
