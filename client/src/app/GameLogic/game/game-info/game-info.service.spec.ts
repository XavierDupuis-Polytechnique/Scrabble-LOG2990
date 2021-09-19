import { TestBed } from '@angular/core/testing';
import { GameInfoService } from './game-info.service';

describe('GameInfoService', () => {
    let service: GameInfoService;
    const players = [
        { name: 'p1', points: 123 },
        { name: 'p2', points: 456 },
    ];
    const letterBag = { length: 102 };
    const activePlayerIndex = 0;
    const game = { players, letterBag, activePlayerIndex };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameInfoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw Error for getPlayer() if no players were received', () => {
        for (let i = 0; i < game.players.length; i++) {
            expect(() => {
                service.getPlayer(i);
            }).toThrowError('No Players in GameInfo');
        }
    });

    it('should throw Error for getPlayerScore() if no players were received', () => {
        for (let i = 0; i < game.players.length; i++) {
            expect(() => {
                service.getPlayerScore(i);
            }).toThrowError('No Players in GameInfo');
        }
    });

    it('should throw Error for activePlayer if no players were received', () => {
        expect(() => {
            const p = service.activePlayer;
            p.toString();
        }).toThrowError('No Players in GameInfo');
    });

    it('should throw Error for numberOfPlayers if no players were received', () => {
        expect(() => {
            const n = service.numberOfPlayers;
            n.toString();
        }).toThrowError('No Players in GameInfo');
    });

    it('should throw Error for numberOfLettersRemaining if no game was received', () => {
        expect(() => {
            const n = service.numberOfLettersRemaining;
            n.toString();
        }).toThrowError('No Game in GameInfo');
    });

    it('should return the time left for a turn from the Timer', () => {
        expect(service.timeLeftForTurn).toBeTruthy();
    });
});
