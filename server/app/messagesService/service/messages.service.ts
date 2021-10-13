import * as io from 'socket.io';
import * as http from 'http';
import { Room } from '@app/messagesService/service/room';
import { Message } from '@app/messagesService/service/message.interface';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ChatUser } from '@app/messagesService/service/chat-user.interface';

export class MessageHandler {
    private sio: io.Server;
    private activeRooms = new Map<string, Room>();
    private users = new Map<string, ChatUser>();

    constructor(server: http.Server) {
        this.sio = new io.Server(server, {
            path: '/messages',
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });
    }

    handleSockets() {
        this.sio.on('connection', (socket) => {
            console.log(`new connection from ${socket.id}`);
            socket.on('userName', (userName: string) => {
                const id = socket.id;
                if (!this.users.has(id)) {
                    const newUser: ChatUser = {
                        name: userName
                    }
                    this.users.set(id, newUser);
                } else {
                    this.sendError(socket, 'userName already picked');
                }
                console.log('userName', this.users);
            });

            socket.on('roomMessages', (content: string) => {
                const id = socket.id;
                try {
                    this.addMessageToRoom(id, content);
                } catch (e) {
                    this.sendError(socket, (e as Error).message);
                }
            });

            socket.on('joinRoom', (roomID: string) => {
                if (!this.activeRooms.has(roomID)) {
                    this.createRoom(roomID);
                }
                const id = socket.id;
                const user = this.users.get(id);
                if (user) {
                    if (!user.currentRoom) {
                        this.sendError(socket, 'You have already joined a room');
                    } else {
                        user.currentRoom = roomID;
                        socket.join(roomID);
                    }
                }
                console.log('rooms', this.activeRooms);
            });
            socket.emit('hello', 'test');
        });

        this.sio.on('deconnect', (socket) => {
            console.log(`deconnect from ${socket.id}`);
            this.deleteUser(socket.id);
        });
    }

    private addMessageToRoom(socketID: string, content: string): void {
        const user = this.users.get(socketID);
        if (!user) {
            throw Error('You have not entered a name in our system');
        }
        const userName = user.name;
        const message: Message = {
            from: userName,
            content,
        };
        console.log(userName, ':', content);

        const roomID = user.currentRoom;
        if (!roomID) {
            throw Error('No chat room joined');
        }
        const room = this.activeRooms.get(roomID);
        if (!room) {
            throw Error('Room not active anymore');
        }
        this.sio.to(roomID).emit('roomMessages', message);
        room.addMessage(message);
    }

    private createRoom(roomID: string): void {
        this.activeRooms.set(roomID, new Room());
    }

    private deleteUser(socketID: string): void {
        this.users.delete(socketID);
    }

    private sendError(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, errorMessage: string) {
        socket.emit('error', errorMessage);
    }
}
