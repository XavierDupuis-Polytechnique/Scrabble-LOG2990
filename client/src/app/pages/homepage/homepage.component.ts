import { Component, OnInit } from '@angular/core';
import { GameManager } from '@app/GameLogic/game/game-manager';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
    ngOnInit(): void {
        const p1: Player = new User('Xavier');
        p1.hello();
        const gameManager: GameManager = new GameManager(p1);
        gameManager.createGame();

        return;
    }
}
