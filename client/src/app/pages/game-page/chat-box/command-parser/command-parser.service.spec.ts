/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { CommandParserService } from './command-parser.service';

describe('Service: CommandParser', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CommandParserService],
        });
    });

    it('should ...', inject([CommandParserService], (service: CommandParserService) => {
        expect(service).toBeTruthy();
    }));
});
