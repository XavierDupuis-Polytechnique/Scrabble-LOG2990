import { TestBed } from '@angular/core/testing';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { SameWordTwice } from '@app/game-logic/game/objectives/objectives/same-word-twice/same-word-twice';

describe('SameWordTwice', () => {
    let objective: SameWordTwice;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        objective = new SameWordTwice(TestBed.inject(ObjectiveNotifierService));
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
