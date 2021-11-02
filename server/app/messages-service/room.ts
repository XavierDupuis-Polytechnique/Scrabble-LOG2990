import { Message } from '@app/messages-service/message.interface';

export class Room {
    messages: Message[] = [];
    userNames = new Set<string>();
    userNameToId = new Map<string, string>();
    addMessage(message: Message): void {
        this.messages.push(message);
    }

    addUser(userName: string, userId: string) {
        this.userNames.add(userName);
        this.userNameToId.set(userName, userId);
    }

    deleteUser(userName: string) {
        this.userNames.delete(userName);
    }
}
