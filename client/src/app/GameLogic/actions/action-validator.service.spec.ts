import { TestBed } from '@angular/core/testing';

import { ActionValidatorService } from './action-validator.service';

describe('ActionValidatorService', () => {
    let service: ActionValidatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ActionValidatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
