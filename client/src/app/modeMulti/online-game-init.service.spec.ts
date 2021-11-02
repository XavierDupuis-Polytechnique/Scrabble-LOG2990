import { TestBed } from '@angular/core/testing';
import { SocketMock } from '@app/GameLogic/socket-mock';
import { OnlineGameSettings } from '@app/modeMulti/interface/game-settings-multi.interface';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
// import { io } from 'socket.io-client';
// import { environment } from 'src/environments/environment';

fdescribe('OnlineGameInitService', () => {
    let service: OnlineGameInitService;
    // const tempSocket = io(environment.serverSocketUrl, { path: '/newGame' });
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OnlineGameInitService);

        service.connectToSocket = jasmine.createSpy().and.returnValue(new SocketMock());
        service.connect();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('createGame should throw error if game settings are not valid', () => {
        expect(() => {
            const gameSettings = { playerName: false, randomBonus: false, timePerTurn: 65000 } as unknown;
            service.createGameMulti(gameSettings as OnlineGameSettings);
        }).toThrowError();
    });

    it('createGame should emit createGame if game settings are valid', () => {
        const spyWaitingForPlayer = spyOn(service, 'waitForSecondPlayer');
        const gameSettings = { playerName: 'allo', randomBonus: false, timePerTurn: 65000 };
        service.createGameMulti(gameSettings);
        expect(spyWaitingForPlayer).toHaveBeenCalled();
    });

    it('join pending game should throw error if socket not connected', () => {
        spyOnProperty(service.socket, 'connected', 'get').and.returnValue(false);
        expect(() => {
            service.joinPendingGame('abc', 'allo');
        }).toThrowError();
    });

    it('join pending game should emit joinGame', () => {
        spyOnProperty(service.socket, 'connected', 'get').and.returnValue(true);
        spyOn(service, 'listenErrorMessage');
        spyOn(service, 'listenForGameToken');
        service.joinPendingGame('abc', 'allo1');
        expect(service.listenErrorMessage).toHaveBeenCalled();
        expect(service.listenForGameToken).toHaveBeenCalled();
    });
});
