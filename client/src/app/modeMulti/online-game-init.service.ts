import { Injectable } from '@angular/core';
import { OnlineGameSettings, OnlineGameSettingsUI } from '@app/modeMulti/interface/game-settings-multi.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class OnlineGameInitService {
    pendingGameId$ = new Subject<string>();
    pendingGames$ = new BehaviorSubject<OnlineGameSettings[]>([]);
    gameToken$ = new Subject<string>();
    private socket: io.Socket;
    // constructor() {}

    connect() {
        this.socket = io.connect(environment.serverSocketUrl, { path: '/newGame' });
        if (this.socket.connected === undefined) {
            throw Error("Can't connect to server");
        }
    }

    disconnect() {
        this.socket.disconnect();
    }

    createGameMulti(gameSettings: OnlineGameSettingsUI) {
        if (!this.socket.connected) {
            this.connect();
        }
        if (gameSettings.playerName !== undefined && gameSettings.randomBonus !== undefined && gameSettings.timePerTurn !== undefined) {
            this.socket.emit('createGame', gameSettings);
        }
    }

    waitForSecondPlayer() {
        this.socket.on('pendingGameId', (pendingGameid: string) => {
            this.pendingGameId$.next(pendingGameid);
        });

        this.socket.on('gameJoined', (gameToken: string) => {
            this.gameToken$.next(gameToken);
            console.log(this.gameToken$);
        });
    }

    joinPendingGame(id: string, playerName: string) {
        this.socket.emit('joinGame', id, playerName);
    }

    listenForPendingGames() {
        if (this.socket.connected === undefined) {
            this.connect();
        }
        this.socket.on('pendingGames', (pendingGames: OnlineGameSettings[]) => {
            this.pendingGames$.next(pendingGames);
        });
    }
}
