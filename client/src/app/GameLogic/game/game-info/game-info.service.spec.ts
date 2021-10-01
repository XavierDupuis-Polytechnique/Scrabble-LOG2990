import { TestBed } from '@angular/core/testing';
import { THOUSAND } from '@app/GameLogic/constants';
import { User } from '@app/GameLogic/player/user';
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

    it('should properly store the user', () => {
        const user = new User('p1');
        service.receiveUser(user);
        expect(service.user).toBeTruthy();
        expect(service.user.name).toBe(user.name);
    });

    it('should return the player with provided index', () => {
        const user0 = new User('p1');
        const user1 = new User('p2');
        service.players = [user0, user1];
        expect(service.getPlayer(0)).toEqual(user0);
        expect(service.getPlayer(1)).toEqual(user1);
    });

    it('should return the player points with provided index', () => {
        const user0 = new User('p1');
        user0.points = Math.floor(Math.random() * THOUSAND);
        const user1 = new User('p2');
        user1.points = Math.floor(Math.random() * THOUSAND);
        service.players = [user0, user1];
        expect(service.getPlayerScore(0)).toBe(user0.points);
        expect(service.getPlayerScore(1)).toBe(user1.points);
    });

    it('should return the number of players', () => {
        service.players = [new User('p1'), new User('p2')];
        expect(service.numberOfPlayers).toBe(service.players.length);
    });
});
