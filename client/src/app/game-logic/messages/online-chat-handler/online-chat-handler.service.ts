import { Injectable } from '@angular/core';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { ChatMessage } from '@app/game-logic/messages/message.interface';
import { isSocketConnected } from '@app/game-logic/utils';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OnlineChatHandlerService {
    socket: Socket;
    private newRoomMessageSubject = new Subject<ChatMessage>();
    private errorSubject = new Subject<string>();
    private sysMessageSubject = new Subject<string>();

    constructor(private gameInfo: GameInfoService) {}

    joinChatRoomWithUser(roomID: string) {
        const userName = this.gameInfo.user.name;
        this.socket = this.connectToSocket();
        this.joinChatRoom(roomID, userName);
    }

    leaveChatRoom() {
        if (!this.socket) {
            throw Error('No socket to disconnect from room');
        }
        this.socket.close();
        this.socket = undefined as unknown as Socket;
    }

    sendMessage(content: string) {
        if (!this.socket) {
            throw Error('No socket to send message from');
        }
        this.socket.emit('newMessage', content);
    }

    private joinChatRoom(roomID: string, userName: string) {
        if (this.socket) {
            this.socket.on('error', (errorContent: string) => {
                this.receiveChatServerError(errorContent);
            });

            this.socket.on('roomMessages', (message: ChatMessage) => {
                this.receiveServerMessage(message);
            });

            this.socket.on('systemMessages', (content: string) => {
                this.receiveSystemMessage(content);
            });

            this.socket.emit('userName', userName);
            this.socket.emit('joinRoom', roomID);
        }
    }

    private connectToSocket() {
        return io(environment.serverSocketUrl, { path: '/messages' });
    }

    private receiveChatServerError(content: string) {
        this.errorSubject.next(content);
    }

    private receiveServerMessage(message: ChatMessage) {
        this.newRoomMessageSubject.next(message);
    }

    private receiveSystemMessage(content: string) {
        this.sysMessageSubject.next(content);
    }

    get isConnected(): boolean {
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
}
