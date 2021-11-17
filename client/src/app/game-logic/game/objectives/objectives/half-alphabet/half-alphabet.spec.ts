import { TestBed } from '@angular/core/testing';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { HalfAlphabet } from '@app/game-logic/game/objectives/objectives/half-alphabet/half-alphabet';

describe('HalfAlphabet', () => {
    let objective: HalfAlphabet;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        objective = new HalfAlphabet(TestBed.inject(ObjectiveNotifierService));
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
