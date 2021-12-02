import { Injectable } from '@angular/core';
import { isGameSettings } from '@app/game-logic/utils';
import { OnlineGameSettings, OnlineGameSettingsUI } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class NewOnlineGameSocketHandler {
    pendingGameId$ = new Subject<string>();
    pendingGames$ = new BehaviorSubject<OnlineGameSettings[]>([]);
    startGame$ = new BehaviorSubject<OnlineGameSettings | undefined>(undefined);
    isDisconnected$ = new Subject<boolean>();
    error$ = new Subject<string>();
    socket: Socket;

    resetGameToken() {
        this.startGame$.next(undefined);
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

    private connect() {
        this.socket = this.connectToSocket();
        this.socket.on('connect_error', () => {
            this.isDisconnected$.next(true);
        });
    }

    private listenErrorMessage() {
        this.socket.on('error', (errorContent: string) => {
            this.error$.next(errorContent);
        });
    }

    private waitForSecondPlayer() {
        this.socket.on('pendingGameId', (pendingGameid: string) => {
            this.pendingGameId$.next(pendingGameid);
        });
        this.listenForGameToken();
    }

    private listenForGameToken() {
        this.socket.on('gameJoined', (gameSetting: OnlineGameSettings) => {
            this.startGame$.next(gameSetting);
            this.disconnectSocket();
        });
    }

    private connectToSocket() {
        return io(environment.serverSocketUrl, { path: '/newGame' });
    }
}
