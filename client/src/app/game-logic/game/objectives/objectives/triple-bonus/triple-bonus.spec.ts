import { TestBed } from '@angular/core/testing';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { TripleBonus } from '@app/game-logic/game/objectives/objectives/triple-bonus/triple-bonus';

describe('TripleBonus', () => {
    let objective: TripleBonus;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        objective = new TripleBonus(TestBed.inject(ObjectiveNotifierService));
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
