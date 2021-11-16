import { TestBed } from '@angular/core/testing';
import { SameWordTwice } from '@app/game-logic/game/objectives/objectives/same-word-twice/same-word-twice';

describe('SameWordTwice', () => {
    let objective: SameWordTwice;

    beforeEach(() => {
        objective = new SameWordTwice();
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
