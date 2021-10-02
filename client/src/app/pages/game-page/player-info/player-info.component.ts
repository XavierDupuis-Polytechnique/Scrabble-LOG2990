import { Component } from '@angular/core';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent {
    constructor(public info: GameInfoService) {}
}
