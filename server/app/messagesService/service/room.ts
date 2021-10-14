import { Message } from '@app/messagesService/service/message.interface';

export class Room {
    messages: Message[] = [];
    userNames = new Set<string>();
    addMessage(message: Message): void {
        this.messages.push(message);
    }

    addUser(userName: string) {
        this.userNames.add(userName);
    }

    deleteUser(userName: string) {
        this.userNames.delete(userName);
    }
}
