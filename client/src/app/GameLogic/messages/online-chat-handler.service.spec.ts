// import * as io from 'socket.io';
import { TestBed } from '@angular/core/testing';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
// import { createServer } from 'http';
import { OnlineChatHandlerService } from './online-chat-handler.service';
// import { AddressInfo } from 'net';
// import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment';
// import { AddressInfo } from 'net';

describe('OnlineChatHandlerService', () => {
    let service: OnlineChatHandlerService;
    // let soi: io.Server;

    beforeEach(() => {
        const gameInfo = { user: { name: 'Tim' } };
        TestBed.configureTestingModule({ providers: [{ provide: GameInfoService, useValue: gameInfo }] });
        service = TestBed.inject(OnlineChatHandlerService);
        // const httpServer = createServer();
        // soi = new io.Server(httpServer, { path: '/messages' });
        // httpServer.listen(() => {
        //     const address = httpServer.address();
        //     const port = (address as AddressInfo).port;
        //     environment.socketServerUrl = `http://localhost:${port}`;
        //     done();
        // });
        // const address = httpServer.address();
        // const port = (address as AddressInfo).port;
        // environment.socketServerUrl = `http://localhost:${port}`;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should join chat room', (done) => {
        // soi.on('connection', () => {
        //     expect(true).toBeFalsy();
        //     done();
        // });
        const roomID = 'abc';
        const name = 'Tim';
        service.joinChatRoom(roomID, name);
        done();
    });

    it('should throw when joining another chat room', () => {
        const roomID = 'abc';
        const name = 'Tim';
        service.joinChatRoom(roomID, name);
        expect(() => {
            service.joinChatRoom(roomID, name);
        }).toThrowError('Already connected to a chat room');
    });

    it('should throw when leaving chat room without joining a chat room', () => {
        expect(() => {
            service.leaveChatRoom();
        }).toThrowError('No socket to disconnect from room');
    });

    it('should throw when sending message without joining a chat room', () => {
        expect(() => {
            service.sendMessage('allo');
        }).toThrowError('No socket to send message from');
    });
});
