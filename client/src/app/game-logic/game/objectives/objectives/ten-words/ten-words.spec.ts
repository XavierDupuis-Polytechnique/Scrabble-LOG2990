import { TestBed } from '@angular/core/testing';
import { TenWords } from '@app/game-logic/game/objectives/objectives/ten-words/ten-words';

describe('FifteenWords', () => {
    let objective: TenWords;

    beforeEach(() => {
        objective = new TenWords();
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
