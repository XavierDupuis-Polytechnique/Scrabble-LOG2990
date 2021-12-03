import { TestBed } from '@angular/core/testing';
import { OfflineGameCreationParams, OnlineGameCreationParams } from '@app/game-logic/game/games/game-creator/game-creation-params';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { SpecialOnlineGame } from '@app/game-logic/game/games/special-games/special-online-game';
import { GameCreatorService } from './game-creator.service';

describe('GameCreatorService', () => {
    let service: GameCreatorService;
    const randomBonus = false;
    const timePerTurn = 10000;
    const id = 'id';
    const username = 'p1';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameCreatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create offline game', () => {
        const gameCreationParams: OfflineGameCreationParams = { randomBonus, timePerTurn };
        const newGame = service.createOfflineGame(gameCreationParams);
        expect(newGame).toBeInstanceOf(OfflineGame);
    });

    it('should create special offline game', () => {
        const gameCreationParams: OfflineGameCreationParams = { randomBonus, timePerTurn };
        const newGame = service.createSpecialOfflineGame(gameCreationParams);
        expect(newGame).toBeInstanceOf(SpecialOfflineGame);
    });

    it('should create online game', () => {
        const gameCreationParams: OnlineGameCreationParams = { id, timePerTurn, username };
        const newGame = service.createOnlineGame(gameCreationParams);
        expect(newGame).toBeInstanceOf(OnlineGame);
    });

    it('should create special online game', () => {
        const gameCreationParams: OnlineGameCreationParams = { id, timePerTurn, username };
        const newGame = service.createSpecialOnlineGame(gameCreationParams);
        expect(newGame).toBeInstanceOf(SpecialOnlineGame);
    });
});
