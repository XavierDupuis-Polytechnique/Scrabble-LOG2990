import { TestBed } from '@angular/core/testing';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ThreeSameLetters } from '@app/game-logic/game/objectives/objectives/three-same-letters/three-same-letters';

describe('ThreeSameLetters', () => {
    let objective: ThreeSameLetters;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        objective = new ThreeSameLetters(TestBed.inject(ObjectiveNotifierService));
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
