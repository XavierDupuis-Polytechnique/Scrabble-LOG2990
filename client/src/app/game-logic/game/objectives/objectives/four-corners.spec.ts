import { TestBed } from '@angular/core/testing';
import { FourCorners } from '@app/game-logic/game/objectives/objectives/four-corners';

describe('FourCorners', () => {
    let objective: FourCorners;

    beforeEach(() => {
        objective = new FourCorners();
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
