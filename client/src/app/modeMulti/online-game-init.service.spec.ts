import { TestBed } from '@angular/core/testing';
import { SocketMock } from '@app/GameLogic/socket-mock';
import { OnlineGameSettings } from '@app/modeMulti/interface/game-settings-multi.interface';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
import { first, take } from 'rxjs/operators';
import { Socket } from 'socket.io-client';

describe('OnlineGameInitService', () => {
    let service: OnlineGameInitService;
    let createSocketFunction: () => Socket;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OnlineGameInitService);
        createSocketFunction = service.connectToSocket;
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

    it('createGame should emit createGame if game settings are valid and receive pendingGameId', () => {
        const spyWaitingForPlayer = spyOn(service, 'waitForSecondPlayer').and.callThrough();
        const gameSettings = { playerName: 'allo', randomBonus: false, timePerTurn: 65000 };
        service.createGameMulti(gameSettings);
        expect(spyWaitingForPlayer).toHaveBeenCalled();
        service.pendingGameId$.pipe(take(1)).subscribe((value) => {
            expect(value[0]).toEqual('aa');
        });
        service.socket.peerSideEmit('pendingGameId', 'aa');
    });

    it('join pending game should throw error if socket not connected', () => {
        spyOnProperty(service.socket, 'connected', 'get').and.returnValue(false);
        expect(() => {
            service.joinPendingGame('abc', 'allo');
        }).toThrowError();
    });

    it('join pending game should emit joinGame and receive GameToken', () => {
        spyOnProperty(service.socket, 'connected', 'get').and.returnValue(true);
        spyOn(service, 'listenForGameToken').and.callThrough();
        spyOn(service, 'disconnectSocket').and.callThrough();
        service.joinPendingGame('abc', 'allo1');
        expect(service.listenForGameToken).toHaveBeenCalled();

        service.gameToken$.pipe(first()).subscribe((value) => {
            expect(value[0]).toEqual('aa');
        });
        service.socket.peerSideEmit('gameJoined', 'aa');
        expect(service.disconnectSocket).toHaveBeenCalled();
    });

    it('listenForPendingGames should return pending games', () => {
        const pendingGames = [{ id: '1', timePerTurn: 60000, playerName: 'allo1', randomBonus: false }];

        service.pendingGames$.pipe().subscribe((value) => {
            expect(value).not.toBeUndefined();
        });
        service.listenForPendingGames();
        service.socket.peerSideEmit('pendingGames', pendingGames as OnlineGameSettings[]);
    });

    it('listenForError should return error message', () => {
        const errorMessage = 'Cant create game';
        service.error$.pipe(first()).subscribe((value: string) => {
            expect(value).toMatch(errorMessage);
        });
        service.listenErrorMessage();
        service.socket.peerSideEmit('error', errorMessage);
    });

    it('disconnect if connect to server fail', () => {
        service.connect();
        service.isDisconnected$.pipe(take(1)).subscribe((value) => {
            expect(value).toBeTrue();
        });
        service.socket.peerSideEmit('connect_error', true);
    });

    it('should not disconnect if socket not connected', () => {
        const spyDisconnect = spyOn(service.socket, 'disconnect');
        service.socket = undefined;
        service.disconnectSocket();
        expect(spyDisconnect).not.toHaveBeenCalled();
    });

    it('connectToSocket should create socket', () => {
        expect(createSocketFunction().disconnected).toBeTrue();
    });
});
