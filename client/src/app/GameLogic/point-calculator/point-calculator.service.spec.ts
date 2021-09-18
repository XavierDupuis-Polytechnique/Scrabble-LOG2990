import { TestBed } from '@angular/core/testing';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from './point-calculator.service';
// class MockGame {
//     MAXCONSECUTIVEPASS = 6;
//     consecutivePass: Number = 0;
//     players: Player[];
//     playerActive: Player = new User('ActivePlayer');
//     otherPlayer: Player = new User('otherPlayer');
//     constructor(consecutivePass: Number) {
//         this.playerActive.letterRack = [
//             { char: 'A', value: 1 },
//             { char: 'B', value: 3 },
//             { char: 'C', value: 3 },
//             { char: 'D', value: 2 },
//             { char: 'E', value: 1 },
//             { char: 'F', value: 4 },
//             { char: 'F', value: 2 },
//         ];
//         this.otherPlayer.letterRack = [
//             { char: 'G', value: 4 },
//             { char: 'H', value: 1 },
//             { char: 'I', value: 8 },
//             { char: 'J', value: 10 },
//             { char: 'K', value: 1 },
//             { char: 'L', value: 2 },
//             { char: 'M', value: 1 },
//         ];
//         this.players = [this.playerActive, this.otherPlayer];
//     }
//     getactivePlayer() {
//         return this.players[0];
//     }
// }
describe('PointCalculatorService', () => {
    let servicePoints: PointCalculatorService;
    const player1: Player = new User('Tim');
    const player2: Player = new User('Max');
    let rack: Letter[];
    let word: Tile[];
    // let listOfWord: Array<Tile[]>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // providers: [{ provide: Game, useClass: MockGame }],
        });

        servicePoints = TestBed.inject(PointCalculatorService);
        rack = [
            { char: 'A', value: 1 },
            { char: 'B', value: 3 },
            { char: 'C', value: 3 },
            { char: 'D', value: 3 },
            { char: 'E', value: 2 },
            { char: 'F', value: 1 },
            { char: 'F', value: 4 },
        ];

        player1.letterRack = rack;
    });

    it('should be created', () => {
        expect(servicePoints).toBeTruthy();
    });
    it('should calculate the correct points of players full rack', () => {
        let totalPointsInRack = 0;
        for (const letter of rack) {
            totalPointsInRack += letter.value;
        }

        expect(servicePoints.calculatePointsOfRack(player1)).toBe(totalPointsInRack);
    });

    it('should calculate the correct points of players empty rack', () => {
        let totalPointsInRack = 0;
        expect(servicePoints.calculatePointsOfRack(player2)).toBe(totalPointsInRack);
    });
    it('should calculate the correct points of a word with letter multiplicator', () => {
        let totalPointsInRack = 11; //TODO:change
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        expect(servicePoints.calculatePointsOfWord(word)).toBe(totalPointsInRack);
    });

    it('should calculate the correct points of a word with word multiplicator', () => {
        let totalPointsInRack = 33;
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 3 },
        ];
        expect(servicePoints.calculatePointsOfWord(word)).toBe(totalPointsInRack);
    });
    // it('should calculate the correct points of a word placing all the players letters', () => {
    //     let totalPointsInRack = 83;
    //     word = [
    //         { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
    //         { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //         { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //         { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //         { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //         { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 3 },
    //     ];
    //     listOfWord.push(word); //Error in KArma
    //     expect(servicePoints.placeLetterPointsCalculation(player2, listOfWord)).toBe(totalPointsInRack);
    // });
    // it('should calculate the correct points at the end of a game if game was abandon', () => {
    //     let game: MockGame = new MockGame(6);
    //     let totalPointsInRack = 0;
    //     for (const letter of rack) {
    //         totalPointsInRack += letter.value;
    //     }
    //     expect(servicePoints.endOfGamePointdeduction(game)).toBe(totalPointsInRack);
    // });
});
