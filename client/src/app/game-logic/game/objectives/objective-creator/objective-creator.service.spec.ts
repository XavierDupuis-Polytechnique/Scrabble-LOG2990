import { TestBed } from '@angular/core/testing';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveCreator } from './objective-creator.service';

describe('ObjectiveManager', () => {
    let creator: ObjectiveCreator;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        creator = new ObjectiveCreator(TestBed.inject(ObjectiveNotifierService));
    });

    it('should be created', () => {
        expect(creator).toBeTruthy();
    });
});
