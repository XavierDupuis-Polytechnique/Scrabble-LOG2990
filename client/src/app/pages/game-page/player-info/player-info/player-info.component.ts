import { Component, OnInit } from '@angular/core';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent implements OnInit {
    // isItMyTurn: boolean;

    constructor(private gameManager: GameManagerService, private info: GameInfoService, private avs: ActionValidatorService) {}

    ngOnInit() {}

    abandonner(): void {
        this.gameManager.stopGame();
    }

    passer() {
        this.avs.sendAction(new PassTurn(this.info.user));
    }

    get isItMyTurn() {
        return this.info.user === this.info.activePlayer;
    }
}
