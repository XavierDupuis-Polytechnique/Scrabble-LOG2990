import { AfterViewInit, Component } from '@angular/core';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { Letter } from '@app/GameLogic/game/letter.interface';

@Component({
    selector: 'app-horse',
    templateUrl: './horse.component.html',
    styleUrls: ['./horse.component.scss'],
})
export class HorseComponent implements AfterViewInit {
    playerRack: Letter[];

    constructor(private gameManagerService: GameManagerService) {}

    ngAfterViewInit(): void {
        this.playerRack = this.gameManagerService.game.players[0].letterRack;
    }
}
