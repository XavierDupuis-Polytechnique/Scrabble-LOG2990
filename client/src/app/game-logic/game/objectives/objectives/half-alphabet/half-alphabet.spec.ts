import { TestBed } from '@angular/core/testing';
import { HalfAlphabet } from '@app/game-logic/game/objectives/objectives/half-alphabet/half-alphabet';

describe('HalfAlphabet', () => {
    let objective: HalfAlphabet;

    beforeEach(() => {
        objective = new HalfAlphabet();
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
