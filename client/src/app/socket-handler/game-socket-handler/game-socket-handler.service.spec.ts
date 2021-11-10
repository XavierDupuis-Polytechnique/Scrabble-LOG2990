import { TestBed } from '@angular/core/testing';
import { GameState } from '@app/game-logic/game/games/online-game/game-state';
import { TimerControls } from '@app/game-logic/game/timer/timer-controls.enum';
import { SocketMock } from '@app/game-logic/socket-mock';
import { OnlineAction, OnlineActionType } from '@app/socket-handler/interfaces/online-action.interface';
import { UserAuth } from '@app/socket-handler/interfaces/user-auth.interface';
import { take } from 'rxjs/operators';
import { Socket } from 'socket.io-client';
import { GameSocketHandlerService } from './game-socket-handler.service';

describe('GameSocketHandlerService', () => {
    let service: GameSocketHandlerService;
    let tempSocket: Socket;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameSocketHandlerService);
        tempSocket = service.connectToSocket();
        service.connectToSocket = jasmine.createSpy().and.returnValue(new SocketMock());
        const userAuth: UserAuth = { playerName: 'Test', gameToken: '1' };
        service.joinGame(userAuth);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('joinGame should throw error if already connected', () => {
        expect(() => {
            const userAuth: UserAuth = { playerName: 'Test', gameToken: '1' };
            service.joinGame(userAuth);
        }).toThrowError();
    });

    it('on gameState should call receiveGameState', () => {
        const spy = spyOn(service, 'receiveGameState');
        const mockGameState = {};
        service.socket.peerSideEmit('gameState', mockGameState);
        expect(spy).toHaveBeenCalled();
    });

    it('on timerControl should call receiveTimerControl', () => {
        const spy = spyOn(service, 'receiveTimerControl');
        const mockTimerControl: TimerControls = TimerControls.Start;
        service.socket.peerSideEmit('timerControl', mockTimerControl);
        expect(spy).toHaveBeenCalled();
    });

    it('receiveTimerControl should set next subject', () => {
        const timerControl = TimerControls.Start;
        service.timerControls$.subscribe((value: TimerControls) => {
            expect(value).toEqual(timerControl);
        });
        service.receiveTimerControl(timerControl);
    });

    it('playAction should emit nextAction', () => {
        const spy = spyOn(service.socket, 'emit');
        const onlineAction: OnlineAction = { type: OnlineActionType.Pass };
        service.playAction(onlineAction);
        expect(spy).toHaveBeenCalled();
        service.socket = undefined;
        expect(() => {
            service.playAction(onlineAction);
        }).toThrowError();
    });

    it('playAction should throw if socket is disconected', () => {
        spyOnProperty(service.socket, 'disconnected', 'get').and.returnValue(true);
        const onlineAction: OnlineAction = { type: OnlineActionType.Pass };

        expect(() => {
            service.playAction(onlineAction);
        }).toThrowError();
    });

    it('forfeit should disconnect socket', () => {
        const spy = spyOn(service.socket, 'disconnect');
        service.disconnect();
        expect(spy).toHaveBeenCalled();
        service.socket = undefined;
        expect(() => {
            service.disconnect();
        }).toThrowError();
    });

    it('receiveGameState should set gameStateSubject', () => {
        let gameStateSubject: GameState = {} as GameState;
        service.gameState$.pipe(take(1)).subscribe((value) => {
            gameStateSubject = value;
        });
        const gameState = { isEndOfGame: false } as GameState;
        service.receiveGameState(gameState);
        expect(gameStateSubject.isEndOfGame).toBeFalse();
    });

    it('connectToSocket should return a socket', () => {
        expect(tempSocket instanceof Socket).toBeTrue();
    });
});