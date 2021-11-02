import { Injectable } from '@angular/core';
import { isGameSettings } from '@app/GameLogic/utils';
import { OnlineGameSettings, OnlineGameSettingsUI } from '@app/modeMulti/interface/game-settings-multi.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class OnlineGameInitService {
    pendingGameId$ = new Subject<string>();
    pendingGames$ = new BehaviorSubject<OnlineGameSettings[]>([]);
    gameToken$ = new Subject<string>();
    isDisconnected$ = new Subject<boolean>();
    error$ = new Subject<string>();
    private socket: Socket;

    connect() {
        this.socket = io(environment.serverSocketUrl, { path: '/newGame' });
        this.socket.on('connect_error', () => {
            this.isDisconnected$.next(true);
        });
    }

    createGameMulti(gameSettings: OnlineGameSettingsUI) {
        this.connect();
        if (!isGameSettings(gameSettings)) {
            throw Error('Games Settings are not valid. Cannot create a game.');
        }
        this.socket.emit('createGame', gameSettings);
        this.waitForSecondPlayer();
    }

    listenForPendingGames() {
        this.connect();
        this.socket.on('pendingGames', (pendingGames: OnlineGameSettings[]) => {
            this.pendingGames$.next(pendingGames);
        });
    }

    listenErrorMessage() {
        this.socket.on('error', (errorContent) => {
            this.error$.next(errorContent);
        });
    }

    joinPendingGame(id: string, playerName: string) {
        if (!this.socket.connected) {
            throw Error("Can't join game, not connected to server");
        }
        this.socket.emit('joinGame', id, playerName);
        this.listenForGameToken();
        this.listenErrorMessage();
    }

    disconnectSocket() {
        if (!this.socket) {
            return;
        }
        this.socket.disconnect();
    }

    private waitForSecondPlayer() {
        this.socket.on('pendingGameId', (pendingGameid: string) => {
            this.pendingGameId$.next(pendingGameid);
        });
        this.listenForGameToken();
    }

    private listenForGameToken() {
        this.socket.on('gameJoined', (gameToken: string) => {
            this.gameToken$.next(gameToken);
            this.disconnectSocket();
        });
    }
}
