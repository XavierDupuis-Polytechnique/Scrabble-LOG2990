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
                try {
                    this.createUser(userName, socket.id);
                } catch (e) {
                    this.sendError(socket, e);
                }
                console.log('userName', this.users);
            });

            socket.on('roomMessages', (content: string) => {
                try {
                    this.addMessageToRoom(socket.id, content);
                } catch (e) {
                    this.sendError(socket, e);
                }
            });

            socket.on('joinRoom', (roomID: string) => {
                try {
                    this.addUserToRoom(socket, roomID);
                } catch (e) {
                    this.sendError(socket, e);
                }
                console.log('rooms', this.activeRooms);
            });

            socket.on('disconnect', () => {
                console.log(`deconnect from ${socket.id}`);
                this.deleteUser(socket.id);
            });
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

    private createUser(userName: string, socketID: string) {
        if (this.users.has(socketID)) {
            throw Error("Vous avez déjà choisi un nom d'utilisateur");
        }
        const newUser: ChatUser = {
            name: userName,
        };
        this.users.set(socketID, newUser);
    }

    private addUserToRoom(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, roomID: string) {
        const socketID = socket.id;
        const user = this.users.get(socketID);
        if (!user) {
            throw Error("Vous n'avez pas encore choisi un nom");
        }
        const userRoom = user.currentRoom;
        if (userRoom) {
            throw Error('Vous êtes déjà dans une salle');
        }

        let activeRoom = this.activeRooms.get(roomID);
        if (!activeRoom) {
            activeRoom = this.createRoom(roomID);
        }
        activeRoom.addUser(user.name);
        user.currentRoom = roomID;
        socket.join(roomID);
    }

    private createRoom(roomID: string): Room {
        const newRoom = new Room();
        this.activeRooms.set(roomID, newRoom);
        return newRoom;
    }

    private deleteUser(socketID: string): void {
        const user = this.users.get(socketID);
        if (!user) {
            return;
        }
        this.users.delete(socketID);
        const roomID = user.currentRoom;
        if (!roomID) {
            return;
        }
        const room = this.activeRooms.get(roomID);
        if (!room) {
            return;
        }
        room.deleteUser(user.name);
        if (room.userNames.size === 0) {
            this.deleteRoom(roomID);
        }
    }

    private deleteRoom(roomID: string) {
        console.log('deleting', roomID);
        this.activeRooms.delete(roomID);
    }

    private sendError(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, error: Error) {
        const errorMessage = error.message;
        socket.emit('error', errorMessage);
    }
}
