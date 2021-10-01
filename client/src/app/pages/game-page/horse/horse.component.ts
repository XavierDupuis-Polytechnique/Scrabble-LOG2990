import { AfterContentInit, Component } from '@angular/core';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';

@Component({
    selector: 'app-horse',
    templateUrl: './horse.component.html',
    styleUrls: ['./horse.component.scss'],
})
export class HorseComponent implements AfterContentInit {
    playerRack: Letter[];

    constructor(private info: GameInfoService) {}

    ngAfterContentInit(): void {
        this.playerRack = this.info.user.letterRack;
    }
}
