import { Injectable } from '@angular/core';
import { Player } from '@app/GameLogic/player/player';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    players: Player[];
}
