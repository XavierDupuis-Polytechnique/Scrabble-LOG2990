import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from './message.interface';

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    messagesLog: Message[] = [];

    messages$: BehaviorSubject<Message[]> = new BehaviorSubject([] as Message[]);

    receiveMessage(message: Message) {
        this.messagesLog.push(message);
        this.messages$.next(this.messagesLog);
        // TODO put command parser here
    }
}
