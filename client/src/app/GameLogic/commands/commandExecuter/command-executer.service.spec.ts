import { TestBed } from '@angular/core/testing';

import { CommandExecuterService } from './command-executer.service';

describe('CommandExecuterService', () => {
    let service: CommandExecuterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommandExecuterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
