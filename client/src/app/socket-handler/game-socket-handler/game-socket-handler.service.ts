import { Injectable } from '@angular/core';
import { ForfeitedGameState, GameState } from '@app/game-logic/game/games/online-game/game-state';
import { TimerControls } from '@app/game-logic/game/timer/timer-controls.enum';
import { OnlineAction } from '@app/socket-handler/interfaces/online-action.interface';
import { UserAuth } from '@app/socket-handler/interfaces/user-auth.interface';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
export interface GameAuth {
    playerName: string;
    gameToken: string;
}

const HAVE_NOT_JOINED_GAME_ERROR = 'You havent join a game';
const SERVER_OFFLINE_ERROR = 'The game server is offline';
const GAME_ALREADY_JOINED = 'You have already joined a game';

@Injectable({
    providedIn: 'root',
})
export class GameSocketHandlerService {
    socket: Socket;

    private forfeitGameStateSubject = new Subject<ForfeitedGameState>();
    get forfeitGameState$(): Subject<ForfeitedGameState> {
        return this.forfeitGameStateSubject;
    }

    private gameStateSubject = new Subject<GameState>();
    get gameState$(): Observable<GameState> {
        return this.gameStateSubject;
    }

    private timerControlsSubject = new Subject<TimerControls>();
    get timerControls$(): Observable<TimerControls> {
        return this.timerControlsSubject;
    }

    private disconnectedFromServerSubject = new Subject<void>();
    get disconnectedFromServer$(): Observable<void> {
        return this.disconnectedFromServerSubject;
    }

    joinGame(userAuth: UserAuth) {
        if (this.socket) {
            throw Error(GAME_ALREADY_JOINED);
        }
        this.socket = this.connectToSocket();
        this.socket.emit('joinGame', userAuth);
        this.socket.on('gameState', (gameState: GameState) => {
            this.receiveGameState(gameState);
        });

        this.socket.on('timerControl', (timerControl: TimerControls) => {
            this.receiveTimerControl(timerControl);
        });

        this.socket.on('connect_error', () => {
            this.disconnectedFromServerSubject.next();
        });

        this.socket.on('disconnected', () => {
            this.disconnectedFromServerSubject.next();
        });

        this.socket.on('transitionGameState', (lastGameState: ForfeitedGameState) => {
            this.receiveForfeitedGameState(lastGameState);
        });
    }

    playAction(action: OnlineAction) {
        if (!this.socket) {
            throw Error(HAVE_NOT_JOINED_GAME_ERROR);
        }

        if (this.socket.disconnected) {
            throw Error(SERVER_OFFLINE_ERROR);
        }
        this.socket.emit('nextAction', action);
    }

    disconnect() {
        if (!this.socket) {
            throw Error(HAVE_NOT_JOINED_GAME_ERROR);
        }
        this.socket.disconnect();
        this.socket = undefined as unknown as Socket;
    }

    private connectToSocket() {
        return io(environment.serverSocketUrl, { path: '/game' });
    }

    private receiveGameState(gameState: GameState) {
        this.gameStateSubject.next(gameState);
    }

    private receiveTimerControl(timerControl: TimerControls) {
        this.timerControlsSubject.next(timerControl);
    }

    private receiveForfeitedGameState(forfeitedGameState: ForfeitedGameState) {
        this.forfeitGameState$.next(forfeitedGameState);
    }
}
