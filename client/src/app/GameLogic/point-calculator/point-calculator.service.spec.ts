import { TestBed } from '@angular/core/testing';
import { Letter } from '../game/letter.interface';
import { Player } from '../player/player';
import { User } from '../player/user';
import { PointCalculatorService } from './point-calculator.service';
class GameMock {
    MAXCONSECUTIVEPASS = 6;
    consecutivePass: Number = 0;
    players: Player[];
    playerActive: Player = new User('ActivePlayer');
    otherPlayer: Player = new User('otherPlayer');
    constructor(consecutivePass: Number, service: PointCalculatorService) {
        this.playerActive.letterRack = [
            { char: 'A', value: 1 },
            { char: 'B', value: 3 },
            { char: 'C', value: 3 },
            { char: 'D', value: 2 },
            { char: 'E', value: 1 },
            { char: 'F', value: 4 },
            { char: 'F', value: 2 },
        ];
        this.otherPlayer.letterRack = [
            { char: 'G', value: 4 },
            { char: 'H', value: 1 },
            { char: 'I', value: 8 },
            { char: 'J', value: 10 },
            { char: 'K', value: 1 },
            { char: 'L', value: 2 },
            { char: 'M', value: 1 },
        ];
        this.players = [this.playerActive, this.otherPlayer];
    }
    getactivePlayer() {
        return;
    }
}
describe('PointCalculatorService', () => {
    let service: PointCalculatorService;
    const player1: Player = new User('Tim');
    const player2: Player = new User('Max');
    let rack: Letter[];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PointCalculatorService);
        rack = [
            { char: 'A', value: 1 },
            { char: 'B', value: 1 },
            { char: 'C', value: 3 },
            { char: 'D', value: 3 },
            { char: 'E', value: 2 },
            { char: 'F', value: 1 },
            { char: 'F', value: 4 },
        ];
        player1.letterRack = rack;
        player2.letterRack = rack;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should calculate the correct points of players full rack', () => {
        let totalPointsInRack = 0;
        for (const letter of rack) {
            totalPointsInRack += letter.value;
        }

        expect(service.calculatePointsOfRack(player1)).toBe(totalPointsInRack);
    });

    it('should calculate the correct points of players empty rack', () => {
        let totalPointsInRack = 0;
        expect(service.calculatePointsOfRack(player2)).toBe(totalPointsInRack);
    });

    //TOdO:
    // it('should calculate the correct points at the end of a game if game was abandon', () => {
    //     let game: GameMock = new GameMock(6,service);
    //     let totalPointsInRack = 0;
    //     for (const letter of rack) {
    //         totalPointsInRack += letter.value;
    //     }

    //     expect().toBe(totalPointsInRack);
    // });
});
