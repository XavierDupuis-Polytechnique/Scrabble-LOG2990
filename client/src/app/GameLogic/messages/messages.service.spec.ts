/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { CommandType } from '@app/GameLogic/commands/command.interface';
import { ChatMessage } from '@app/GameLogic/messages/chat-message.interface';
import { Message, MessageType } from '@app/GameLogic/messages/message.interface';
import { OnlineChatHandlerService } from '@app/GameLogic/messages/online-chat-handler.service';
import { Observable, Subject } from 'rxjs';
import { MessagesService } from './messages.service';

describe('Service: Messages', () => {
    let service: MessagesService;
    let commandParserSpy: jasmine.SpyObj<CommandParserService>;
    let onlineChatSpy: jasmine.SpyObj<OnlineChatHandlerService>;
    const mockOpponentMessage$ = new Subject<ChatMessage>();
    const mockErrorMessage$ = new Subject<string>();

    beforeEach(() => {
        commandParserSpy = jasmine.createSpyObj('CommandParserService', ['parse']);
        onlineChatSpy = jasmine.createSpyObj('OnlineChatHandler', ['sendMessage'], ['connected', 'opponentMessage$', 'errorMessage$']);
        (Object.getOwnPropertyDescriptor(onlineChatSpy, 'opponentMessage$')?.get as jasmine.Spy<() => Observable<ChatMessage>>).and.returnValue(
            mockOpponentMessage$,
        );
        (Object.getOwnPropertyDescriptor(onlineChatSpy, 'errorMessage$')?.get as jasmine.Spy<() => Observable<string>>).and.returnValue(
            mockErrorMessage$,
        );

        TestBed.configureTestingModule({
            providers: [
                { provide: CommandParserService, useValue: commandParserSpy },
                { provide: OnlineChatHandlerService, useValue: onlineChatSpy },
            ],
        });
        service = TestBed.inject(MessagesService);
    });

    it('should create message', () => {
        expect(service).toBeTruthy();
    });

    it('should receive message', () => {
        const from = 'paul';
        const content = 'allo';
        service.receiveMessagePlayer(from, content);
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
        service.receiveMessagePlayer(from, content);
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
        service.receiveMessagePlayer('tim', 'to be');
        service.receiveMessagePlayer('cook', 'or');
        service.receiveMessagePlayer('apple', 'not to be');
        const prevNLogs = service.messagesLog.length;
        expect(prevNLogs).toBe(3);
        service.clearLog();
        const nLogs = service.messagesLog.length;
        expect(nLogs).toBe(0);
    });

    it('should catch a thrown error because the message is invalid', () => {
        const errorContent = 'mot ou emplacement manquant';
        const message = '?!?@#?!@#?';
        commandParserSpy.parse.and.throwError(errorContent);
        const spyReceiveError = spyOn(service, 'receiveError');

        service.receiveMessageOpponent('Tim', message);

        expect(spyReceiveError).toHaveBeenCalled();
    });

    it('should not throw error when message is valid', () => {
        const message = 'l l';

        commandParserSpy.parse.and.returnValue(CommandType.Exchange);
        const spyReceiveError = spyOn(service, 'receiveError');

        service.receiveMessageOpponent('Tim', message);

        expect(spyReceiveError).not.toHaveBeenCalled();
    });

    it('should not throw error when message is valid', () => {
        const message = 'l lasd';

        commandParserSpy.parse.and.returnValue(CommandType.Exchange);
        const spyReceiveError = spyOn(service, 'receiveError');

        service.receiveMessageOpponent('Tim', message);

        expect(spyReceiveError).not.toHaveBeenCalled();
    });

    it('should not send command to chat server', () => {
        const userName = 'Tim';
        const command = '!placer h8h hello';
        (Object.getOwnPropertyDescriptor(onlineChatSpy, 'connected')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);
        commandParserSpy.parse.and.returnValue(CommandType.Place);
        service.receiveMessagePlayer(userName, command);
        expect(onlineChatSpy.sendMessage).not.toHaveBeenCalled();
    });

    it('should send message to chat server', () => {
        const userName = 'Tim';
        const message = 'hello';
        (Object.getOwnPropertyDescriptor(onlineChatSpy, 'connected')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);
        commandParserSpy.parse.and.returnValue(undefined);
        service.receiveMessagePlayer(userName, message);
        expect(onlineChatSpy.sendMessage).toHaveBeenCalledOnceWith(message);
    });

    it('should receive opponent message from chat server', () => {
        const from = 'Paul';
        const content = 'Hi';
        const chatMessage = { from, content };
        const spy = spyOn(service, 'receiveMessageOpponent');
        mockOpponentMessage$.next(chatMessage);
        expect(spy).toHaveBeenCalledOnceWith(from, content);
    });

    it('should receive error message from chat server', () => {
        const errorContent = 'Error error error';
        const spy = spyOn(service, 'receiveErrorMessage');
        mockErrorMessage$.next(errorContent);
        expect(spy).toHaveBeenCalledOnceWith(errorContent);
    });
});
