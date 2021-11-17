import { TestBed } from '@angular/core/testing';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { NineLettersWord } from '@app/game-logic/game/objectives/objectives/nine-letters-word/nine-letters-word';

describe('NineLettersWord', () => {
    let objective: NineLettersWord;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        objective = new NineLettersWord(TestBed.inject(ObjectiveNotifierService));
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
