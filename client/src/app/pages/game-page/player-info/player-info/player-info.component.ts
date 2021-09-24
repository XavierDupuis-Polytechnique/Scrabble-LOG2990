import { Component } from '@angular/core';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent {
    info: GameInfoService;
    constructor(private gameManager: GameManagerService, gameInfoService: GameInfoService) {
        this.info = gameInfoService;
    }
    abandonner(): void {
        this.gameManager.stopGame();
    }
}
