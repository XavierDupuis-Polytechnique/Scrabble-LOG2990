import { Injectable } from '@angular/core';
import { GameState } from '@app/GameLogic/game/game-state';
import { OnlineAction } from '@app/socket-handler/online-action.interface';
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
    private socket: Socket | undefined;
    private gameStateSubject = new Subject<GameState>();
    private endTurnSubject = new Subject<void>();
    get gameState$(): Observable<GameState> {
        return this.gameStateSubject;
    }

    get endTurn$(): Observable<void> {
        return this.endTurnSubject;
    }

    joinGame(gameToken: string) {
        if (this.socket) {
            throw Error(GAME_ALREADY_JOINED);
        }
        this.socket = io(environment.serverSocketUrl, { path: '/game' });
        this.socket.emit('joinGame', gameToken);
        this.socket.on('gameState', this.receiveGameState);
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

    forfeit() {
        if (!this.socket) {
            throw Error(HAVE_NOT_JOINED_GAME_ERROR);
        }
        this.socket?.disconnect();
    }

    private receiveGameState(gameState: unknown) {
        console.log('game state received', gameState);
        return gameState;
    }
}
