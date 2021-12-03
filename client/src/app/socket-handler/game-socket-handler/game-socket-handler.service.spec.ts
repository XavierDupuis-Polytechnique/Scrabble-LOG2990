/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ForfeitedGameState, GameState } from '@app/game-logic/game/games/online-game/game-state';
import { TimerControls } from '@app/game-logic/game/timer/timer-controls.enum';
import { SocketMock } from '@app/game-logic/socket-mock';
import { OnlineAction, OnlineActionType } from '@app/socket-handler/interfaces/online-action.interface';
import { UserAuth } from '@app/socket-handler/interfaces/user-auth.interface';
import { take } from 'rxjs/operators';
import { GameSocketHandlerService } from './game-socket-handler.service';

describe('GameSocketHandlerService', () => {
    let service: GameSocketHandlerService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameSocketHandlerService);
        service['connectToSocket'] = jasmine.createSpy().and.returnValue(new SocketMock());
        service['connectToSocket']();
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
        const spy = spyOn<any>(service, 'receiveGameState');
        const mockGameState = {};
        (service.socket as any).peerSideEmit('gameState', mockGameState);
        expect(spy).toHaveBeenCalled();
    });

    it('on transitionGameState should call receiveForfeitedGameState', () => {
        const spy = spyOn<any>(service, 'receiveForfeitedGameState');
        const mockGameState = {};
        (service.socket as any).peerSideEmit('transitionGameState', mockGameState);
        expect(spy).toHaveBeenCalled();
    });

    it('on timerControl should call receiveTimerControl', () => {
        const spy = spyOn<any>(service, 'receiveTimerControl');
        const mockTimerControl: TimerControls = TimerControls.Start;
        (service.socket as any).peerSideEmit('timerControl', mockTimerControl);
        expect(spy).toHaveBeenCalled();
    });

    it('receiveTimerControl should set next subject', () => {
        const timerControl = TimerControls.Start;
        service.timerControls$.subscribe((value: TimerControls) => {
            expect(value).toEqual(timerControl);
        });
        service['receiveTimerControl'](timerControl);
    });

    it('playAction should emit nextAction', () => {
        const spy = spyOn(service.socket, 'emit');
        const onlineAction: OnlineAction = { type: OnlineActionType.Pass };
        service.playAction(onlineAction);
        expect(spy).toHaveBeenCalled();
        (service.socket as unknown) = undefined;
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
        (service.socket as unknown) = undefined;
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
        service['receiveGameState'](gameState);
        expect(gameStateSubject.isEndOfGame).toBeFalse();
    });

    it('receiveTransitionGameState should set forfeitGameStateSubject', () => {
        let forfeitGameStateSubject: ForfeitedGameState = {} as ForfeitedGameState;
        service.forfeitGameState$.pipe(take(1)).subscribe((value) => {
            forfeitGameStateSubject = value;
        });
        const forfeitGameState = { lettersRemaining: 3 } as ForfeitedGameState;
        service['receiveForfeitedGameState'](forfeitGameState);
        expect(forfeitGameStateSubject.lettersRemaining).toEqual(3);
    });

    it('should receive disconnected event and handle it properly', (done) => {
        service.disconnectedFromServer$.subscribe(() => {
            expect(true).toBeTrue();
            done();
        });
        (service.socket as any).peerSideEmit('disconnected');
    });

    it('should receive forfeited gamestate and handle it properly', (done) => {
        service.forfeitGameState$.subscribe((forfeitedState) => {
            expect(forfeitedState).toBeTruthy();
            done();
        });
        const forfeitedGameState = {} as unknown as ForfeitedGameState;
        (service.socket as any).peerSideEmit('transitionGameState', forfeitedGameState);
    });

    it('should emit disconnected from server when receiving connect_error', (done) => {
        service.disconnectedFromServer$.subscribe(() => {
            expect(true).toBeTrue();
            done();
        });
        (service.socket as any).peerSideEmit('connect_error');
    });
});
