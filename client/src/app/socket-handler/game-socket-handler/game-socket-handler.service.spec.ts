import { TestBed } from '@angular/core/testing';

import { GameSocketHandlerService } from './game-socket-handler.service';

describe('GameSocketHandlerService', () => {
    let service: GameSocketHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameSocketHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
