import * as io from 'socket.io';
import * as http from 'http';
import { Room } from '@app/messagesService/service/room';
import { Message } from '@app/messagesService/service/message.interface';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ChatUser } from '@app/messagesService/service/chat-user.interface';
import { MAX_MESSAGE_LENGTH } from '@app/constants';

export class MessageHandler {
    activeRooms = new Map<string, Room>();
    users = new Map<string, ChatUser>();
    readonly sio: io.Server;

    constructor(server: http.Server) {
        this.sio = new io.Server(server, {
            path: '/messages',
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });
    }

    handleSockets() {
        this.sio.on('connection', (socket) => {
            socket.on('userName', (userName: string) => {
                try {
                    this.createUser(userName, socket.id);
                } catch (e) {
                    this.sendError(socket, e);
                }
            });

            socket.on('newMessage', (content: string) => {
                try {
                    this.sendMessageToRoom(socket.id, content);
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
            });

            socket.on('disconnect', () => {
                this.deleteUser(socket.id);
            });
        });
    }

    private sendMessageToRoom(socketID: string, content: string): void {
        const user = this.users.get(socketID);
        if (!user) {
            throw Error("Vous n'avez pas encore entré votre nom dans notre systême");
        }

        if (content.length > MAX_MESSAGE_LENGTH) {
            throw Error('Le message doit être plus petit que 512 charactères');
        }

        const userName = user.name;
        const message: Message = {
            from: userName,
            content,
        };

        const roomID = user.currentRoom;
        if (!roomID) {
            throw Error("Vous n'avez pas rejoint de salle de chat");
        }

        const room = this.activeRooms.get(roomID);
        if (!room) {
            throw Error("La salle de chat n'est plus active");
        }

        this.sendMessageToRoomSockets(roomID, message);
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
        this.activeRooms.delete(roomID);
    }

    private sendError(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, error: Error) {
        const errorMessage = error.message;
        socket.emit('error', errorMessage);
    }

    private sendMessageToRoomSockets(roomID: string, message: Message) {
        this.sio.to(roomID).emit('roomMessages', message);
    }
}
