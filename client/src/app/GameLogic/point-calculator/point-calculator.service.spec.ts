import { TestBed } from '@angular/core/testing';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { BoardService } from '@app/services/board.service';
import { PlaceLetter } from '../actions/place-letter';
import { Board } from '../game/board';
import { Game } from '../game/games/game';
import { TimerService } from '../game/timer/timer.service';
import { PointCalculatorService } from './point-calculator.service';

class MockGame extends Game {
    MAX_CONSECUTIVE_PASS: number = 6;
    activePlayer: Player = new User('ActivePlayer');
    otherPlayer: Player = new User('otherPlayer');
    players: Player[] = [this.activePlayer, this.otherPlayer];
    consecutivePass: number = 6;
    board: Board = new Board();

    constructor(time: number, timerService: TimerService, pointCalculatorService: PointCalculatorService, boardService: BoardService) {
        super(time, timerService, pointCalculatorService, boardService);
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

    let rack: Letter[] = [
        { char: 'A', value: 1 },
        { char: 'B', value: 3 },
        { char: 'C', value: 3 },
        { char: 'D', value: 3 },
        { char: 'E', value: 2 },
        { char: 'F', value: 1 },
        { char: 'F', value: 4 },
    ];

    let emptyRack: Letter[] = [];
    let word: Tile[];
    let listOfWord: Tile[][] = [];

    beforeEach(() => {
        TestBed.configureTestingModule({});

        servicePoints = TestBed.inject(PointCalculatorService);

        timer = TestBed.inject(TimerService);
        boardService = TestBed.inject(BoardService);
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
        player2.letterRack = emptyRack;
        expect(servicePoints.calculatePointsOfRack(player2)).toBe(0);
    });

    it('should calculate the correct points of a word with letter multiplicator', () => {
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        expect(servicePoints.calculatePointsOfWord(word)).toBe(11);
    });

    it('should calculate the correct points of a word with word multiplicator', () => {
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 2 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 3 },
        ];
        expect(servicePoints.calculatePointsOfWord(word)).toBe(66);
    });

    it('should calculate the correct points of a word when placing all the players letters if >=7', () => {
        const bateau = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'E', value: 1 },
            { char: 'A', value: 1 },
            { char: 'U', value: 1 },
            { char: 'X', value: 8 },
        ];
        const word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 3 },
            { letterObject: { char: 'X', value: 8 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        listOfWord.pop();
        listOfWord.push(word);
        const action = new PlaceLetter(player2, bateau, { x: 6, y: 6, direction: 'h' });
        player2.letterRack = emptyRack;
        expect(servicePoints.placeLetterPointsCalculation(player2, action, listOfWord)).toBe(110);
    });

    it('should not calculate bonus when player place all letter if rack was not full (on end of game)', () => {
        let game = new MockGame(30, timer, servicePoints, boardService);
        game.consecutivePass = 0;
        const threeLetterRack = [
            { char: 'C', value: 3 },
            { char: 'E', value: 1 },
            { char: 'T', value: 1 },
        ];
        const word = [
            { letterObject: { char: 'C', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        listOfWord.pop();
        listOfWord.push(word);
        const action = new PlaceLetter(player2, threeLetterRack, { x: 6, y: 6, direction: 'h' });

        game.activePlayer.points = 150;
        game.otherPlayer.points = 50;
        game.activePlayer.letterRack = emptyRack;
        game.otherPlayer.letterRack = rack;
        expect(servicePoints.placeLetterPointsCalculation(game.activePlayer, action, listOfWord)).toBe(8);
        expect(game.activePlayer.points).toBe(158);
        servicePoints.endOfGamePointdeduction(game as Game);

        expect(game.activePlayer.points).toBe(175);
        expect(game.otherPlayer.points).toBe(33);
    });

    it('should calculate the correct points at the end of game after 6 consecutive pass', () => {
        const threeLetterRack = [
            { char: 'C', value: 3 },
            { char: 'E', value: 1 },
            { char: 'T', value: 1 },
        ];
        let game = new MockGame(30, timer, servicePoints, boardService);
        game.activePlayer.points = 150;
        game.otherPlayer.points = 50;
        game.activePlayer.letterRack = rack;
        game.otherPlayer.letterRack = threeLetterRack;
        servicePoints.endOfGamePointdeduction(game as Game);

        expect(game.activePlayer.points).toBe(133);
        expect(game.otherPlayer.points).toBe(45);
    });
});
