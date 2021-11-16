import { TestBed } from '@angular/core/testing';
import { TripleBonus } from '@app/game-logic/game/objectives/objectives/triple-bonus/triple-bonus';

describe('TripleBonus', () => {
    let objective: TripleBonus;

    beforeEach(() => {
        objective = new TripleBonus();
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
