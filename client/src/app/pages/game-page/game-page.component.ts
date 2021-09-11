import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    constructor(
        private gameManager: GameManagerService,
        private router: Router
    ) {}

    ngOnInit() {
        try {
            this.gameManager.startGame();
        } catch (e) {
            alert("Pas de partie crée pour l'instant");
            this.router.navigate(['/']);
        }
    }
}
