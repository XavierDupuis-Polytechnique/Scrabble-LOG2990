import { TestBed } from '@angular/core/testing';
import { Palindrome } from '@app/game-logic/game/objectives/objectives/palindrome/palindrome';

describe('Palindrome', () => {
    let objective: Palindrome;

    beforeEach(() => {
        objective = new Palindrome();
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
