import { Component } from '@angular/core';
import { GameLetter } from '@app/GameLogic/game/game-letter';

@Component({
    selector: 'app-horse',
    templateUrl: './horse.component.html',
    styleUrls: ['./horse.component.scss'],
})
export class HorseComponent {
    playerRack: GameLetter[];
}
