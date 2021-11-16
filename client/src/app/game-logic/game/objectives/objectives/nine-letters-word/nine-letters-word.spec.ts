import { TestBed } from '@angular/core/testing';
import { NineLettersWord } from '@app/game-logic/game/objectives/objectives/nine-letters-word/nine-letters-word';

describe('NineLettersWord', () => {
    let objective: NineLettersWord;

    beforeEach(() => {
        objective = new NineLettersWord();
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
