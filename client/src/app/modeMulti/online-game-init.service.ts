import { Injectable } from '@angular/core';
import { GameSettingsMulti, GameSettingsMultiUI } from '@app/modeMulti/interface/game-settings-multi.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class OnlineGameInitService {
    pendingGameId$ = new Subject<string>();
    pendingGames$ = new BehaviorSubject<GameSettingsMulti[]>([]);
    private socket: io.Socket;
    // constructor() {}

    connect() {
        this.socket = io.connect(environment.serverSocketUrl, { path: '/newGame' });
    }
    disconnect() {
        this.socket.disconnect();
    }

    createGameMulti(gameSettings: GameSettingsMultiUI) {
        if (gameSettings.playerName !== undefined && gameSettings.randomBonus !== undefined && gameSettings.timePerTurn !== undefined) {
            this.socket.emit('createGame', gameSettings);
        }
    }

    waitForSecondPLayer() {
        this.socket.on('pendingGameId', (pendingGameid: string) => {
            this.pendingGameId$.next(pendingGameid);
        });
    }

    listenForPendingGames() {
        this.socket.on('pendingGames', (pendingGames: GameSettingsMulti[]) => {
            this.pendingGames$.next(pendingGames);
        });
    }
}
