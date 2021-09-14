import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Message } from './message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor() { }
  messagesLog: Message[] = [];

  messages$: BehaviorSubject<Message[]> = new BehaviorSubject([] as Message[]);
  
  receiveMesage(message: Message) {
    this.messagesLog.push(message);
    this.messages$.next(this.messagesLog);
    // TODO put command parser here
  }

};
