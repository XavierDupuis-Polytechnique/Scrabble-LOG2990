import * as io from 'socket.io';
import * as http from 'http';
import { Room } from '@app/messagesService/service/room';

export class MessageHandler {
    private sio: io.Server;
    private rooms = new Map<string, Room>();
    private users = new Map<string, string>();

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
                    this.users.set(id, userName);
                }
                console.log('userName', this.users);
            });

            socket.on('newMessage', (content: string) => {
                const rooms = socket.rooms;
                const id = socket.id;
                this.addMessageToRoom(id, content);
                console.log('message rooms', rooms);
            });

            socket.on('joinRoom', (roomID: string) => {
                if (!this.rooms.has(roomID)) {
                    this.createRoom(roomID);
                }
                socket.join(roomID);
                console.log('rooms', this.rooms);
            });
            socket.emit('hello', 'test');
        });

        this.sio.on('deconnect', (socket) => {
            console.log(`deconnect from ${socket.id}`);
            this.deleteUser(socket.id);
        });
    }

    private addMessageToRoom(socketID: string, content: string): void {
        const userName = this.users.get(socketID);
        console.log(userName, ':', content);
    }

    private createRoom(roomID: string): void {
        this.rooms.set(roomID, new Room());
    }

    private deleteUser(socketID: string): void {
        this.users.delete(socketID);
    }
}
