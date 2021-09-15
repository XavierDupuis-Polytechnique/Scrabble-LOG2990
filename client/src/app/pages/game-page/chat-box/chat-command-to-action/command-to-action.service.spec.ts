/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommandToActionService } from './command-to-action.service';

describe('Service: CommandToAction', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CommandToActionService],
        });
    });

    it('should ...', inject([CommandToActionService], (service: CommandToActionService) => {
        expect(service).toBeTruthy();
    }));
});
