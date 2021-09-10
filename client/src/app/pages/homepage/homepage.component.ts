import { Component, OnInit } from '@angular/core';
import { Game } from '@app/GameLogic/game/games/game';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
    gms: GameManagerService;
    game001: Game;

    ngOnInit(): void {
        const p1: Player = new User('Xavier');
        p1.hello();

        this.gms = new GameManagerService();
        this.game001 = this.gms.createGame(p1);
        this.game001.allocateGameLetters();

        return;
    }
}
