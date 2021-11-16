import { TestBed } from '@angular/core/testing';
import { ThreeSameLetters } from '@app/game-logic/game/objectives/objectives/three-same-letters/three-same-letters';

describe('ThreeSameLetters', () => {
    let objective: ThreeSameLetters;

    beforeEach(() => {
        objective = new ThreeSameLetters();
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
