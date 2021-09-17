import { Inject, Injectable } from '@angular/core';
import { Player } from '@app/GameLogic/player/player';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    players: Player[];

    constructor(@Inject(Player) players: Player[]) {
        this.players = players;
    }
}
