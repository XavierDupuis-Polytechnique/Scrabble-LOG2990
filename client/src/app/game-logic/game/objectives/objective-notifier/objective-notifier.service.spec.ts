import { TestBed } from '@angular/core/testing';

import { ObjectiveNotifierService } from './objective-notifier.service';

describe('ObjectiveNotifierService', () => {
    let service: ObjectiveNotifierService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ObjectiveNotifierService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
