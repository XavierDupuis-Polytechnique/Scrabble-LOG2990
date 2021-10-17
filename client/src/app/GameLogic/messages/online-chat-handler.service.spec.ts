import { TestBed } from '@angular/core/testing';

import { OnlineChatHandlerService } from './online-chat-handler.service';

describe('OnlineChatHandlerService', () => {
    let service: OnlineChatHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OnlineChatHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
