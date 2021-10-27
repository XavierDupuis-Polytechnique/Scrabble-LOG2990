import { Injectable } from '@angular/core';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { CommandType } from '@app/GameLogic/commands/command.interface';
import { BehaviorSubject } from 'rxjs';
import { Message, MessageType } from './message.interface';
import { OnlineChatHandlerService } from '@app/GameLogic/messages/online-chat-handler.service';
import { ChatMessage } from '@app/GameLogic/messages/chat-message.interface';
@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    static readonly sysName = 'System';
    static readonly sysErrorName = 'SystemError';
    messagesLog: Message[] = [];

    messages$: BehaviorSubject<Message[]> = new BehaviorSubject([] as Message[]);

    constructor(private commandParser: CommandParserService, private onlineChat: OnlineChatHandlerService) {
        this.onlineChat.opponentMessage$.subscribe((chatMessage: ChatMessage) => {
            const forwarder = chatMessage.from;
            const content = chatMessage.content;
            this.receiveMessageOpponent(forwarder, content);
        });

        this.onlineChat.errorMessage$.subscribe((errorContent: string) => {
            this.receiveErrorMessage(errorContent);
        });

        this.onlineChat.systemMessage$.subscribe((content: string) => {
            this.receiveSystemMessage(content);
        });
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
        const message = {
            content,
            from: forwarder,
            type: MessageType.Player1,
        };

        this.addMessageToLog(message);
        try {
            const commandType = this.commandParser.parse(content, forwarder);
            const messageIsCommand = commandType !== undefined;
            if (!messageIsCommand && this.onlineChat.connected) {
                this.onlineChat.sendMessage(content);
            }
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

    private addMessageToLog(message: Message) {
        this.messagesLog.push(message);
        this.messages$.next(this.messagesLog);
    }
}
