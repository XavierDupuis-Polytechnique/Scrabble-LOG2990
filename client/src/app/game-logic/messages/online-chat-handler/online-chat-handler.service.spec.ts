/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { ChatMessage } from '@app/game-logic/messages/message.interface';
import { OnlineChatHandlerService } from '@app/game-logic/messages/online-chat-handler/online-chat-handler.service';
import { SocketMock } from '@app/game-logic/socket-mock';
import { take } from 'rxjs/operators';

describe('online chat handler', () => {
    const gameInfo = { user: { name: 'Tim' } };
    let service: OnlineChatHandlerService;
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [{ provide: GameInfoService, useValue: gameInfo }] });
        service = TestBed.inject(OnlineChatHandlerService);
        (service.socket as any) = new SocketMock();
        service['joinChatRoom']('1', 'bob');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call error when servit emit error', () => {
        const spy = spyOn<any>(service, 'receiveChatServerError');
        (service.socket as any).peerSideEmit('error', 'test');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call receiveServerMessage when servit emit roomMessage', () => {
        const spy = spyOn<any>(service, 'receiveServerMessage');
        const message: ChatMessage = { content: 'hello there', from: 'General Kenoby' };
        (service.socket as any).peerSideEmit('roomMessages', message);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call receiveSystemMessage when servit emit systemMessages', () => {
        const spy = spyOn<any>(service, 'receiveSystemMessage');
        (service.socket as any).peerSideEmit('systemMessages', 'test');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('joinChatRoomWithUser should call joinChatRoom', () => {
        const spy = spyOn<any>(service, 'joinChatRoom');
        service['joinChatRoomWithUser']('1');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('leaveChatRoom should disconnect the socket', () => {
        service.leaveChatRoom();
        expect(service.isConnected).toBeFalse();
    });

    it('sendMessage should emit a new message', () => {
        const spy = spyOn(service.socket, 'emit');
        service.sendMessage('Hello Word!');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('receiveChatServerError should set next subject', () => {
        let test = '';
        service.errorMessage$.pipe(take(1)).subscribe((value) => {
            test = value;
        });
        service['receiveChatServerError']('Huston we got a problem');
        expect(test).toEqual('Huston we got a problem');
    });

    it('receiveServerMessage should set roomMessage', () => {
        let test: ChatMessage = { content: '', from: '' };
        service.newRoomMessages$.pipe(take(1)).subscribe((value) => {
            test = value;
        });
        const message: ChatMessage = { content: 'Hello There', from: 'General Kenobi' };
        service['receiveServerMessage'](message);
        expect(test).toEqual(message);
    });

    it('receiveSystemMessage shoudl set sysMessage', () => {
        let test = '';
        service.systemMessage$.pipe(take(1)).subscribe((value) => {
            test = value;
        });
        const message = 'Dont look directly on the sun';
        service['receiveSystemMessage'](message);
        expect(test).toEqual(message);
    });

    it('opponent message should only return message from opponent', () => {
        let getter: ChatMessage = { content: '', from: '' };
        const messageOpponent: ChatMessage = { content: 'Hello There', from: 'General Kenobi' };
        const messageMe: ChatMessage = { content: 'Ho ho', from: 'Tim' };
        service.opponentMessage$.subscribe((value) => {
            getter = value;
        });
        service['receiveServerMessage'](messageOpponent);
        service['receiveServerMessage'](messageMe);
        expect(getter).toEqual(messageOpponent);
    });

    it('should throw error when leaving chat room when not connected', () => {
        (service.socket as unknown) = undefined;
        expect(() => {
            service.leaveChatRoom();
        }).toThrowError();
    });

    it('should throw error when leaving chat room when not connected', () => {
        (service.socket as unknown) = undefined;
        expect(() => {
            service.sendMessage('allo');
        }).toThrowError();
    });

    it('should not throw when joining two time a game', () => {
        (service.socket as unknown) = undefined;
        expect(() => {
            service['joinChatRoom']('1', 'bob');
        }).not.toThrowError();
    });
});
