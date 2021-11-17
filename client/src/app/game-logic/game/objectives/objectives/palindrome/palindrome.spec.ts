import { TestBed } from '@angular/core/testing';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { Palindrome } from '@app/game-logic/game/objectives/objectives/palindrome/palindrome';

describe('Palindrome', () => {
    let objective: Palindrome;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        objective = new Palindrome(TestBed.inject(ObjectiveNotifierService));
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
