import { TestBed } from '@angular/core/testing';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';

describe('CommandParserService', () => {
    let service: CommandParserService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommandParserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
