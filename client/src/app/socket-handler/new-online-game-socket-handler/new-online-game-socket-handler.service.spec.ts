/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { DEFAULT_DICTIONARY_TITLE } from '@app/game-logic/constants';
import { SocketMock } from '@app/game-logic/socket-mock';
import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';
import { OnlineGameSettings } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { NewOnlineGameSocketHandler } from '@app/socket-handler/new-online-game-socket-handler/new-online-game-socket-handler.service';
import { first, take } from 'rxjs/operators';
import { Socket } from 'socket.io-client';

describe('NewOnlineGameSocketHandler', () => {
    let service: NewOnlineGameSocketHandler;
    let createSocketFunction: () => Socket;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NewOnlineGameSocketHandler);
        createSocketFunction = service['connectToSocket'];
        service['connectToSocket'] = jasmine.createSpy().and.returnValue(new SocketMock());
        service['connect']();
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
        const spyWaitingForPlayer = spyOn<any>(service, 'waitForSecondPlayer').and.callThrough();
        const gameSettings = {
            playerName: 'allo',
            randomBonus: false,
            timePerTurn: 65000,
            gameMode: GameMode.Classic,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        service.createGameMulti(gameSettings);
        expect(spyWaitingForPlayer).toHaveBeenCalled();
        service.pendingGameId$.pipe(first()).subscribe((value) => {
            expect(value[0]).toEqual('aa');
        });

        (service.socket as any).peerSideEmit('pendingGameId', 'aa');
    });

    it('join pending game should throw error if socket not connected', () => {
        spyOnProperty(service.socket, 'connected', 'get').and.returnValue(false);
        expect(() => {
            service.joinPendingGame('abc', 'allo');
        }).toThrowError();
    });

    it('join pending game should emit joinGame and receive GameSettings', () => {
        const gameSettings = { id: '1', playerName: 'allo', randomBonus: false, timePerTurn: 65000 };

        spyOnProperty(service.socket, 'connected', 'get').and.returnValue(true);
        spyOn<any>(service, 'listenForGameToken').and.callThrough();
        spyOn(service, 'disconnectSocket').and.callThrough();
        service.joinPendingGame('abc', 'allo1');
        expect(service['listenForGameToken']).toHaveBeenCalled();

        (service.socket as any).peerSideEmit('gameJoined', gameSettings);
        service['listenForGameToken']();
        service.startGame$.pipe(first()).subscribe((gameSettingsServer) => {
            expect(gameSettingsServer).not.toBeUndefined();
        });
        expect(service.disconnectSocket).toHaveBeenCalled();
    });

    it('listenForPendingGames should return pending games', () => {
        const pendingGames = [{ id: '1', timePerTurn: 60000, playerName: 'allo1', randomBonus: false }];

        service.pendingGames$.pipe().subscribe((value) => {
            expect(value).not.toBeUndefined();
        });
        service.listenForPendingGames();
        (service.socket as any).peerSideEmit('pendingGames', pendingGames as OnlineGameSettings[]);
    });

    it('listenForError should return error message', () => {
        const errorMessage = 'Cant create game';
        service.error$.pipe(first()).subscribe((value: string) => {
            expect(value).toMatch(errorMessage);
        });
        service['listenErrorMessage']();
        (service.socket as any).peerSideEmit('error', errorMessage);
    });

    it('disconnect if connect to server fail', () => {
        service['connect']();
        service.isDisconnected$.pipe(take(1)).subscribe((value) => {
            expect(value).toBeTrue();
        });
        (service.socket as any).peerSideEmit('connect_error', true);
    });

    it('should not disconnect if socket not connected', () => {
        const spyDisconnect = spyOn(service.socket, 'disconnect');
        (service.socket as any) = undefined;
        service.disconnectSocket();
        expect(spyDisconnect).not.toHaveBeenCalled();
    });

    it('should resetGameToken ', () => {
        service.startGame$.subscribe((value) => {
            expect(value).toBeUndefined();
        });
        service.resetGameToken();
    });

    it('connectToSocket should create socket', () => {
        expect(createSocketFunction().disconnected).toBeTrue();
    });
});
