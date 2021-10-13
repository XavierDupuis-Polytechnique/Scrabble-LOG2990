import { Message } from '@app/messagesService/service/message.interface';

export class Room {
    messages: Message[] = [];
    users: string[];

    addMessage(message: Message) {
        const user = message.from;
        if (!this.users.includes(user)) {
            throw Error('User not in room');
        }

        this.messages.push(message);
    }
}
