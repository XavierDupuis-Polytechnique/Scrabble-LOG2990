/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { Message, MessageType } from '@app/GameLogic/messages/message.interface';
import { MessagesService } from './messages.service';

describe('Service: Messages', () => {
    let service: MessagesService;
    let commandParserSpy: jasmine.SpyObj<CommandParserService>;
    beforeEach(() => {
        commandParserSpy = jasmine.createSpyObj('CommandParserService', ['parse']);
        TestBed.configureTestingModule({
            providers: [{ provide: CommandParserService, useValue: commandParserSpy }],
        });
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

    it('should receive system message', () => {
        const content = 'test';
        service.receiveSystemMessage(content);
        const expectedMesssage: Message = {
            from: 'System',
            content,
            type: MessageType.System,
        };
        const log = service.messagesLog;
        const lastMessage = log[log.length - 1];
        expect(lastMessage).toEqual(expectedMesssage);
    });

    it('should receive error', () => {
        const errorContent = 'this is an error';
        const error = new Error(errorContent);
        service.receiveError(error);
        const log = service.messagesLog;
        const lastMessage = log[log.length - 1];
        const message: Message = {
            from: 'SystemError',
            content: errorContent,
            type: MessageType.System,
        };
        expect(lastMessage).toEqual(message);
    });

    it('should catch error when not valid command', () => {
        const errorContent = 'this is a parse error';
        commandParserSpy.parse.and.throwError(errorContent);
        const content = '!notACommand';
        const from = 'tom';
        service.receiveMessage(from, content);
        const log = service.messagesLog;
        const lastMessage = log[log.length - 1];
        const errorMessage: Message = {
            from: 'SystemError',
            content: errorContent,
            type: MessageType.System,
        };
        expect(lastMessage).toEqual(errorMessage);
    });

    it('should receive error Message', () => {
        const errorContent = 'this is a parse error';
        service.receiveErrorMessage(errorContent);
        const log = service.messagesLog;
        const lastMessage = log[log.length - 1];
        const message: Message = {
            from: 'SystemError',
            content: errorContent,
            type: MessageType.System,
        };
        expect(lastMessage).toEqual(message);
    });

    it('should receive error Message', () => {
        const errorContent = 'this is a parse error';
        service.receiveErrorMessage(errorContent);
        const log = service.messagesLog;
        const lastMessage = log[log.length - 1];
        const message: Message = {
            from: 'SystemError',
            content: errorContent,
            type: MessageType.System,
        };
        expect(lastMessage).toEqual(message);
    });

    it('should clear log', () => {
        service.receiveMessage('tim', 'to be');
        service.receiveMessage('cook', 'or');
        service.receiveMessage('apple', 'not to be');
        const prevNLogs = service.messagesLog.length;
        expect(prevNLogs).toBe(3);
        service.clearLog();
        const nLogs = service.messagesLog.length;
        expect(nLogs).toBe(0);
    });
});
