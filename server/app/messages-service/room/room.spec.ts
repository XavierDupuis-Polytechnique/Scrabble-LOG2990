import { Message } from '@app/messages-service/message.interface';
import { Room } from '@app/messages-service/room/room';
import { expect } from 'chai';

describe('Room', () => {
    let room: Room;
    beforeEach(() => {
        room = new Room();
    });

    it('should add message to messages', () => {
        const message: Message = {
            from: 'Test',
            content: 'Allo',
        };
        room.addMessage(message);
        const lastMessage = room.messages[room.messages.length - 1];
        expect(lastMessage).to.equal(message);
    });

    it('should add user name to usersName', () => {
        const userName = 'test';
        const userID = 'testID';
        room.addUser(userName, userID);
        expect(room.userNames.has(userName)).to.equal(true);
    });

    it('should delete user from room', () => {
        const userName = 'test';
        const userID = 'testID';
        room.addUser(userName, userID);
        room.deleteUser(userName);
        expect(room.userNames.size).to.equal(0);
    });
});
