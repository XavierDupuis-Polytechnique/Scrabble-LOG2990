import { Component } from '@angular/core';
import { Letter } from '@app/GameLogic/game/letter.interface';

@Component({
    selector: 'app-horse',
    templateUrl: './horse.component.html',
    styleUrls: ['./horse.component.scss'],
})
export class HorseComponent {
    playerRack: Letter[];
}
