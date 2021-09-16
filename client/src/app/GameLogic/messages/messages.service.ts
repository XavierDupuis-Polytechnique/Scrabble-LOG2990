import { Injectable } from '@angular/core';
// import { verify } from 'crypto';
import { BehaviorSubject } from 'rxjs';
import { Message } from './message.interface';
import { CommandParserService } from '@app/pages/game-page/chat-box/command-parser/command-parser.service';
@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    messagesLog: Message[] = [];

    messages$: BehaviorSubject<Message[]> = new BehaviorSubject([] as Message[]);
    constructor(private commandParser: CommandParserService) {}

    receiveMessage(message: Message) {
        this.commandParser.verifyCommand(message);
        this.messagesLog.push(message);
        this.messages$.next(this.messagesLog);
        // TODO put command parser here
    }
}
