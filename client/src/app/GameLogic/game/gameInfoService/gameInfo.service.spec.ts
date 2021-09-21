/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { GameInfoService } from './gameInfo.service';

describe('Service: GameInfo', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameInfoService],
        });
    });

    it('should ...', inject([GameInfoService], (service: GameInfoService) => {
        expect(service).toBeTruthy();
    }));
});
