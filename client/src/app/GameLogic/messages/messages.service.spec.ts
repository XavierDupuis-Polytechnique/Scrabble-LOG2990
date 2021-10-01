/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { Message, MessageType } from '@app/GameLogic/messages/message.interface';
import { MessagesService } from './messages.service';

describe('Service: Messages', () => {
    let service: MessagesService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MessagesService);
    });

    it('should create message', () => {
        expect(service).toBeTruthy();
    });

    it('should receive message', () => {
        const from = 'paul';
        const content = 'allo';
        service.receiveMessage(from, content);
        const logs = service.messagesLog;
        const lastMessage = logs[logs.length - 1];
        const expectedMesssage: Message = {
            from,
            content,
            type: MessageType.Player1,
        };
        expect(lastMessage).toEqual(expectedMesssage);
    });
});
