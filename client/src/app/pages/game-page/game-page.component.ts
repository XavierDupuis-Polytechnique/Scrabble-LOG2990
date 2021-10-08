import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { UIInputControllerService } from '@app/GameLogic/actions/uiactions/ui-input-controller.service';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { UIInput } from '@app/GameLogic/interface/ui-input';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(
        private gameManager: GameManagerService,
        public info: GameInfoService,
        private avs: ActionValidatorService,
        private router: Router,
        private inputController: UIInputControllerService,
    ) {
        try {
            this.gameManager.startGame();
        } catch (e) {
            this.router.navigate(['/']);
        }
    }

    abandonner(): void {
        this.gameManager.stopGame();
    }

    passer() {
        this.avs.sendAction(new PassTurn(this.info.user));
    }

    get isItMyTurn() {
        try {
            return this.info.user === this.info.activePlayer;
        } catch (e) {
            return false;
        }
    }

    get isEndOfGame() {
        try {
            return this.info.isEndOfGame;
        } catch (e) {
            return false;
        }
    }

    clickLetterRack(input: UIInput) {
        this.inputController.receive(input);
    }
}
