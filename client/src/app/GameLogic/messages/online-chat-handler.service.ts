import { Injectable } from '@angular/core';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { ChatMessage } from '@app/GameLogic/messages/chat-message.interface';
import { isSocketConnected } from '@app/GameLogic/utils';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OnlineChatHandlerService {
    private socket: Socket | undefined;
    private newRoomMessageSubject = new Subject<ChatMessage>();
    private errorSubject = new Subject<string>();
    private sysMessageSubject = new Subject<string>();

    constructor(private gameInfo: GameInfoService) {}

    joinChatRoom(roomID: string, userName: string) {
        if (this.socket) {
            throw Error('Already connected to a chat room');
        }
        this.socket = io(environment.serverSocketUrl, { path: '/messages' });

        this.socket.on('error', (errorContent: string) => {
            this.receiveChatServerError(errorContent);
        });

        this.socket.on('roomMessages', (message: ChatMessage) => {
            this.receiveServerMessage(message);
        });

        this.socket.on('systemMessages', (content: string) => {
            // console.log('received sysMessage from server', sysMessage);
            this.receiveSystemMessage(content);
        });

        this.socket.emit('userName', userName);
        this.socket.emit('joinRoom', roomID);
    }

    joinChatRoomWithUser(roomID: string) {
        const userName = this.gameInfo.user.name;
        this.joinChatRoom(roomID, userName);
    }

    leaveChatRoom() {
        if (!this.socket) {
            throw Error('No socket to disconnect from room');
        }
        this.socket.close();
        this.socket = undefined;
    }

    sendMessage(content: string) {
        if (!this.socket) {
            throw Error('No socket to send message from');
        }
        this.socket.emit('newMessage', content);
    }

    get connected(): boolean {
        return isSocketConnected(this.socket);
    }

    get opponentMessage$(): Observable<ChatMessage> {
        return this.newRoomMessageSubject.pipe(
            filter((chatMessage: ChatMessage) => {
                const name = chatMessage.from;
                const userName = this.gameInfo.user.name;
                return name !== userName;
            }),
        );
    }

    get newRoomMessages$(): Observable<ChatMessage> {
        return this.newRoomMessageSubject;
    }

    get errorMessage$(): Observable<string> {
        return this.errorSubject;
    }

    get systemMessage$(): Observable<string> {
        return this.sysMessageSubject;
    }

    private receiveServerMessage(message: ChatMessage) {
        this.newRoomMessageSubject.next(message);
    }

    private receiveChatServerError(content: string) {
        this.errorSubject.next(content);
    }

    private receiveSystemMessage(content: string) {
        this.sysMessageSubject.next(content);
    }
}
