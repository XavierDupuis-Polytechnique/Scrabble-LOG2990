import { Component, OnInit } from '@angular/core';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent implements OnInit {
    constructor(private gameManager: GameManagerService) {}

    ngOnInit() {}

    abandonner(): void {
        this.gameManager.stopGame();
    }
}
