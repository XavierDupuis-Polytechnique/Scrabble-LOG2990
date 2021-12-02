import { TestBed } from '@angular/core/testing';
import { CommandParserService } from '@app/game-logic/commands/command-parser/command-parser.service';
import { CommandType } from '@app/game-logic/commands/command.interface';
import { ChatMessage, Message, MessageType } from '@app/game-logic/messages/message.interface';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { OnlineChatHandlerService } from '@app/game-logic/messages/online-chat-handler/online-chat-handler.service';
import { Observable, Subject } from 'rxjs';

describe('Service: Messages', () => {
    let service: MessagesService;
    let commandParserSpy: jasmine.SpyObj<CommandParserService>;
    const mockOfflineErrorMessage$ = new Subject<string>();
    let onlineChatSpy: jasmine.SpyObj<OnlineChatHandlerService>;
    let mockOpponentMessage$: Subject<ChatMessage>;
    let mockErrorMessage$: Subject<string>;
    let mockSystemMessage$: Subject<string>;

    beforeEach(() => {
        mockOpponentMessage$ = new Subject<ChatMessage>();
        mockErrorMessage$ = new Subject<string>();
        mockSystemMessage$ = new Subject<string>();

        commandParserSpy = jasmine.createSpyObj('CommandParserService', ['parse', 'sendErrorMessage'], ['errorMessage$']);

        (Object.getOwnPropertyDescriptor(commandParserSpy, 'errorMessage$')?.get as jasmine.Spy<() => Observable<string>>).and.returnValue(
            mockOfflineErrorMessage$,
        );

        onlineChatSpy = jasmine.createSpyObj(
            'OnlineChatHandler',
            ['sendMessage'],
            ['isConnected', 'opponentMessage$', 'errorMessage$', 'systemMessage$'],
        );

        (Object.getOwnPropertyDescriptor(onlineChatSpy, 'opponentMessage$')?.get as jasmine.Spy<() => Observable<ChatMessage>>).and.returnValue(
            mockOpponentMessage$,
        );
        (Object.getOwnPropertyDescriptor(onlineChatSpy, 'errorMessage$')?.get as jasmine.Spy<() => Observable<string>>).and.returnValue(
            mockErrorMessage$,
        );
        (Object.getOwnPropertyDescriptor(onlineChatSpy, 'systemMessage$')?.get as jasmine.Spy<() => Observable<string>>).and.returnValue(
            mockSystemMessage$,
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

    it('should catch error when not valid command', () => {
        const errorContent = 'this is a parse error';
        const content = '!notACommand';
        const from = 'tom';
        service.receiveMessagePlayer(from, content);
        const log = service.messagesLog;
        mockOfflineErrorMessage$.next(errorContent);
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
        const message = '!placer ?!?@#?!@#?';
        const spyReceiveError = spyOn(service, 'receiveErrorMessage');
        service.receiveMessageOpponent('Tim', message);
        mockOfflineErrorMessage$.next(errorContent);
        expect(spyReceiveError).toHaveBeenCalledWith(errorContent);
    });

    it('should not throw error when message is valid', () => {
        const message = 'l l';

        commandParserSpy.parse.and.returnValue(CommandType.Exchange);
        const spyReceiveError = spyOn(service, 'receiveErrorMessage');

        service.receiveMessageOpponent('Tim', message);

        expect(spyReceiveError).not.toHaveBeenCalled();
    });

    it('should not throw error when message is valid', () => {
        const message = 'l lasd';

        commandParserSpy.parse.and.returnValue(CommandType.Exchange);
        const spyReceiveError = spyOn(service, 'receiveErrorMessage');

        service.receiveMessageOpponent('Tim', message);

        expect(spyReceiveError).not.toHaveBeenCalled();
    });

    it('should not send command to chat server', () => {
        const userName = 'Tim';
        const command = '!placer h8h hello';
        (Object.getOwnPropertyDescriptor(onlineChatSpy, 'isConnected')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);
        commandParserSpy.parse.and.returnValue(CommandType.Place);
        service.receiveMessagePlayer(userName, command);
        expect(onlineChatSpy.sendMessage).not.toHaveBeenCalled();
    });

    it('should send message to chat server', () => {
        const userName = 'Tim';
        const message = 'hello';
        (Object.getOwnPropertyDescriptor(onlineChatSpy, 'isConnected')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);
        commandParserSpy.parse.and.returnValue(undefined);
        service.receiveMessagePlayer(userName, message);
        expect(onlineChatSpy.sendMessage).toHaveBeenCalledOnceWith(message);
    });

    it('should receive opponent message from chat server', () => {
        const from = 'Paul';
        const content = 'Hi';
        const chatMessage = { from, content };
        commandParserSpy.parse.and.returnValue(undefined);
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

    it('should receive online system message properly', () => {
        const spy = spyOn(service, 'receiveSystemMessage');
        const content = 'this is a string';
        mockSystemMessage$.next(content);
        expect(spy).toHaveBeenCalledOnceWith(content);
    });
});
