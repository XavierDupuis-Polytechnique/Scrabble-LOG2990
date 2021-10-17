import { Injectable } from '@angular/core';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { CommandType } from '@app/GameLogic/commands/command.interface';
import { BehaviorSubject } from 'rxjs';
import { Message, MessageType } from './message.interface';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '@app/GameLogic/messages/chat-message.interface';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    static readonly sysName = 'System';
    static readonly sysErrorName = 'SystemError';
    messagesLog: Message[] = [];

    messages$: BehaviorSubject<Message[]> = new BehaviorSubject([] as Message[]);
    private socket: Socket | undefined;

    constructor(private commandParser: CommandParserService, private gameInfo: GameInfoService) {}

    joinChatRoom(roomID: string, userName: string) {
        if (this.socket) {
            throw Error('Already connected to a chat room');
        }
        this.socket = io(environment.socketServerUrl, { path: '/messages' });

        this.socket.on('error', (errorContent: string) => {
            this.receiveSystemMessage(errorContent);
        });

        this.socket.on('roomMessages', (message: ChatMessage) => {
            this.receiveServerMessage(message);
        });

        this.socket.emit('userName', userName);
        this.socket.emit('joinRoom', roomID);
    }

    disconnectFromRoom() {
        if (!this.socket) {
            throw Error('No socket to disconnect from room');
        }
        this.socket.close();
        this.socket = undefined;
    }

    receiveSystemMessage(content: string) {
        const systemMessage: Message = {
            content,
            from: MessagesService.sysName,
            type: MessageType.System,
        };
        this.addMessageToLog(systemMessage);
    }

    receiveErrorMessage(content: string) {
        const errorMessage = {
            content,
            from: MessagesService.sysErrorName,
            type: MessageType.System,
        };
        this.addMessageToLog(errorMessage);
    }

    receiveMessagePlayer(forwarder: string, content: string) {
        // TODO make this cleaner
        if (this.socket) {
            if (this.socket.connected) {
                this.socket.emit('newMessage', content);
            }
        }
        const message = {
            content,
            from: forwarder,
            type: MessageType.Player1,
        };

        this.addMessageToLog(message);
        try {
            this.commandParser.parse(content, forwarder);
        } catch (e) {
            this.receiveError(e as Error);
        }
    }

    receiveMessageOpponent(forwarder: string, content: string) {
        const message = {
            content,
            from: forwarder,
            type: MessageType.Player2,
        };
        this.addMessageToLog(message);
        try {
            const command = this.commandParser.parse(content, forwarder);
            if (command === CommandType.Exchange) {
                const hiddenLetters = content.split(' ');
                const numberOfLetters = hiddenLetters[1].length;
                message.content = hiddenLetters[0] + ' ' + numberOfLetters + ' lettre';
                if (numberOfLetters > 1) {
                    message.content += 's';
                }
            }
        } catch (e) {
            this.receiveError(e as Error);
        }
    }

    receiveError(error: Error) {
        const errorMessage = {
            content: error.message,
            from: MessagesService.sysErrorName,
            type: MessageType.System,
        };
        this.addMessageToLog(errorMessage);
    }

    clearLog(): void {
        this.messagesLog = [];
        this.messages$.next(this.messagesLog);
    }

    private receiveServerMessage(message: ChatMessage) {
        // TODO get user name to get type of message to add to log
        const name = message.from;
        const userName = this.gameInfo.user.name;
        if (name !== userName) {
            const content = message.content;
            this.receiveMessageOpponent(name, content);
        }
    }

    private addMessageToLog(message: Message) {
        this.messagesLog.push(message);
        this.messages$.next(this.messagesLog);
    }
}
