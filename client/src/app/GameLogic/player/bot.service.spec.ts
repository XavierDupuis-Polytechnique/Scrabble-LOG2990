import { TestBed } from '@angular/core/testing';
import { BotCreatorService } from './bot-creator.service';

describe('BotService', () => {
    let service: BotCreatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BotCreatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
