import { TestBed } from '@angular/core/testing';

import { GameCreatorService } from './game-creator.service';

describe('GameCreatorService', () => {
    let service: GameCreatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameCreatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
