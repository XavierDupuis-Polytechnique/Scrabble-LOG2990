import { TestBed } from '@angular/core/testing';
import { GameManagerService } from './game-manager.service';

describe('GameManagerService', () => {
    let service: GameManagerService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw error if game is not created first', () => {
        expect(() => {
            service.startGame();
        }).toThrow(Error('No game created yet'));
    });
});
