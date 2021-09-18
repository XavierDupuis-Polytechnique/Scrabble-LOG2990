import { Injectable } from '@angular/core';
import { CommandParserService } from '@app/pages/game-page/chat-box/command-parser/command-parser.service';
// import { verify } from 'crypto';
import { BehaviorSubject } from 'rxjs';
import { Message } from './message.interface';
@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    messagesLog: Message[] = [];

    messages$: BehaviorSubject<Message[]> = new BehaviorSubject([] as Message[]);
    constructor(private commandParser: CommandParserService) {}

    receiveMessage(message: Message) {
        this.commandParser.verifyCommand(message);
        this.addMessageToLog(message);
        // TODO put command parser here
    }

    receiveSystemMessage(content: string) {
        const systemMessage: Message = {
            content,
            from: 'System',
        };
        this.addMessageToLog(systemMessage);
    }

    private addMessageToLog(message: Message) {
        const messageCopy = { ...message };
        this.messagesLog.push(messageCopy);
        this.messages$.next(this.messagesLog);
    }
}
