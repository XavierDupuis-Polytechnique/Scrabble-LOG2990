import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { UIInputControllerService } from '@app/GameLogic/actions/uiactions/ui-input-controller.service';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { InputType, UIInput } from '@app/GameLogic/interface/ui-input';

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

    @HostListener('window:keyup', ['$event']) keypressEvent($event: KeyboardEvent) {
        const input: UIInput = { type: InputType.KeyPress, args: $event.key };
        this.inputController.receive(input);
    }

    clickLetterRack(input: UIInput) {
        this.inputController.receive(input);
    }

    abandonner(): void {
        this.gameManager.stopGame();
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

    get canPlace() {
        return this.isItMyTurn && this.inputController.activeLetters.length !== 0;
    }

    get canExchange() {
        return this.isItMyTurn && this.inputController.activeLetters.length !== 0;
    }

    get canPass() {
        return this.isItMyTurn;
    }

    get canCancel() {
        return this.canPass || this.canExchange;
    }

    // TODO : REROUTE TO UIINPUTCONTROLLER -> REMOVE AVS -> MIGRATE TESTS
    pass() {
        this.avs.sendAction(new PassTurn(this.info.user));
    }

    exchange() {
        this.inputController.confirm();
    }

    place() {
        this.inputController.confirm();
    }

    cancel() {
        this.inputController.cancel();
    }
}
