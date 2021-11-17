import { TestBed } from '@angular/core/testing';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { FourCorners } from '@app/game-logic/game/objectives/objectives/four-corners/four-corners';

describe('FourCorners', () => {
    let objective: FourCorners;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        objective = new FourCorners(TestBed.inject(ObjectiveNotifierService));
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });
});
