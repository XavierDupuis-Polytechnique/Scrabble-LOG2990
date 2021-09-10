import { Component, OnInit } from '@angular/core';
import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
    game: Game;
    ngOnInit(): void {
        const p1: Player = new User('Xavier');
        p1.hello();
        this.game = new Game(p1);
        return;
    }
}
