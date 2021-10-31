import { Injectable } from '@angular/core';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { CommandType } from '@app/GameLogic/commands/command.interface';
import { BehaviorSubject } from 'rxjs';
import { Message, MessageType } from './message.interface';

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    static readonly sysName = 'System';
    static readonly sysErrorName = 'SystemError';
    messagesLog: Message[] = [];
    messages$: BehaviorSubject<Message[]> = new BehaviorSubject([] as Message[]);

    constructor(private commandParser: CommandParserService) {
        commandParser.errorMessage$.subscribe((error) => {
            this.receiveErrorMessage(error);
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
        this.commandParser.parse(content, forwarder);
    }

    receiveMessageOpponent(forwarder: string, content: string) {
        const message = {
            content,
            from: forwarder,
            type: MessageType.Player2,
        };
        this.addMessageToLog(message);
        const command = this.commandParser.parse(content, forwarder);
        if (command === CommandType.Exchange) {
            const hiddenLetters = content.split(' ');
            const numberOfLetters = hiddenLetters[1].length;
            message.content = hiddenLetters[0] + ' ' + numberOfLetters + ' lettre';
            if (numberOfLetters > 1) {
                message.content += 's';
            }
        }
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
