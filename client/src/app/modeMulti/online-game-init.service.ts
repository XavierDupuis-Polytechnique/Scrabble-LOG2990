import { Injectable } from '@angular/core';
import { GameSettingsMultiUI } from '@app/modeMulti/interface/game-settings-multi.interface';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class OnlineGameInitService {
    socket: io.Socket;

    // constructor() {}

    connect() {
        this.socket = io.connect(environment.serverSocketUrl, { path: '/newGame' });
    }

    createGameMulti(gameSettings: GameSettingsMultiUI) {
        if (gameSettings.playerName !== undefined && gameSettings.randomBonus !== undefined && gameSettings.timePerTurn !== undefined) {
            this.socket.emit('createGame', gameSettings);
            console.log('Nouvelle Partie MultiJoueurs');
        }
    }
}
