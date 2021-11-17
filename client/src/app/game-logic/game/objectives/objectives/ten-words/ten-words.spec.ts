import { TestBed } from '@angular/core/testing';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { TenWords } from '@app/game-logic/game/objectives/objectives/ten-words/ten-words';

describe('FifteenWords', () => {
    let objective: TenWords;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        objective = new TenWords(TestBed.inject(ObjectiveNotifierService));
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
