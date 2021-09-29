import { TestBed } from '@angular/core/testing';

import { BotMessagesService } from './bot-messages.service';

describe('BotMessagesService', () => {
    let service: BotMessagesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BotMessagesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
