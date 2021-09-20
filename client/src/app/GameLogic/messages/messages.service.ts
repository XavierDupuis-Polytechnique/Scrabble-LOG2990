import { Injectable } from '@angular/core';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
// import { verify } from 'crypto';
import { BehaviorSubject } from 'rxjs';
import { Message } from './message.interface';
@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    static readonly sysName = 'System';
    static readonly sysErrorName = 'SystemError';
    messagesLog: Message[] = [];

    messages$: BehaviorSubject<Message[]> = new BehaviorSubject([] as Message[]);
    constructor(private commandParser: CommandParserService) {}

    receiveMessage(message: Message) {
        try {
            this.commandParser.parse(message);
            this.addMessageToLog(message);
        } catch (e) {
            if (e instanceof Error) {
                this.addMessageToLog(message);
                this.receiveError(e as Error);
            }
        }
        // TODO put command parser here
    }

    receiveSystemMessage(content: string) {
        const systemMessage: Message = {
            content,
            from: MessagesService.sysName,
        };
        this.addMessageToLog(systemMessage);
    }

    receiveErrorMessage(content: string) {
        const errorMessage = {
            content,
            from: MessagesService.sysErrorName,
        };
        this.addMessageToLog(errorMessage);
    }

    receiveError(error: Error) {
        const errorMessage = {
            content: error.message,
            from: MessagesService.sysErrorName,
        };
        this.addMessageToLog(errorMessage);
    }

    private addMessageToLog(message: Message) {
        const messageCopy = { ...message };
        this.messagesLog.push(messageCopy);
        this.messages$.next(this.messagesLog);
    }
}
