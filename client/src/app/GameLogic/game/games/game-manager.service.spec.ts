import { TestBed } from '@angular/core/testing';
import { GameSettings } from '@app/GameLogic/game/games/game-settings.interface';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { GameManagerService } from './game-manager.service';

describe('GameManagerService', () => {
    let service: GameManagerService;
    const dict = new DictionaryService();
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: dict }],
        });
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

    it('should emit void on start game', () => {
        service.newGame$.subscribe((v: void) => {
            expect(v).toBeFalsy();
        });
        const gameSettings: GameSettings = {
            timePerTurn: 10,
            playerName: 'allo',
            botDifficulty: 'easy',
            randomBonus: false,
        };
        service.createGame(gameSettings);
        service.startGame();
        service.stopGame();
        expect().nothing();
    });

    it('should not start new game if game exists', () => {
        const gameSettings: GameSettings = {
            timePerTurn: 10,
            playerName: 'allo',
            botDifficulty: 'easy',
            randomBonus: false,
        };
        service.createGame(gameSettings);
        const gameSpy = spyOn(service, 'stopGame').and.callFake(() => {
            return false;
        });
        service.createGame(gameSettings);
        expect(gameSpy).toHaveBeenCalled();
    });
});
