import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AbandonButtonComponent } from '@app/components/abandon-button/abandon-button.component';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { UIExchange } from '@app/GameLogic/actions/ui-actions/ui-exchange';
import { UIInputControllerService } from '@app/GameLogic/actions/ui-actions/ui-input-controller.service';
import { UIPlace } from '@app/GameLogic/actions/ui-actions/ui-place';
import { RACK_LETTER_COUNT } from '@app/GameLogic/constants';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { InputType, UIInput } from '@app/GameLogic/interface/ui-input';
import { DisconnectedFromServerComponent } from '@app/pages/classic-game/modals/disconnected-from-server/disconnected-from-server.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    dialogRef: MatDialogRef<DisconnectedFromServerComponent> | undefined;
    constructor(
        private gameManager: GameManagerService,
        public info: GameInfoService,
        private avs: ActionValidatorService,
        private router: Router,
        public dialog: MatDialog,
        private inputController: UIInputControllerService,
    ) {
        try {
            this.gameManager.startGame();
        } catch (e) {
            this.router.navigate(['/']);
        }
        this.gameManager.disconnectedFromServer$.subscribe(() => {
            this.openDisconnected();
        });
    }

    @HostListener('window:keyup', ['$event'])
    keypressEvent($event: KeyboardEvent) {
        const input: UIInput = { type: InputType.KeyPress, args: $event.key };
        this.inputController.receive(input);
    }

    receiveInput(input: UIInput) {
        this.inputController.receive(input);
    }

    abandon(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        this.dialog.open(AbandonButtonComponent, dialogConfig);
    }

    get isItMyTurn() {
        try {
            if (this.isEndOfGame) {
                return false;
            }
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
        return this.isItMyTurn && this.inputController.activeAction instanceof UIPlace && this.inputController.canBeExecuted;
    }

    get canExchange() {
        return (
            this.isItMyTurn &&
            this.inputController.activeAction instanceof UIExchange &&
            this.inputController.canBeExecuted &&
            this.info.numberOfLettersRemaining > RACK_LETTER_COUNT
        );
    }

    get canPass() {
        return this.isItMyTurn;
    }

    get canCancel() {
        return this.canPlace || this.canExchange;
    }

    // TODO : REROUTE TO UIINPUTCONTROLLER -> REMOVE AVS -> MIGRATE TESTS
    pass() {
        this.avs.sendAction(new PassTurn(this.info.user));
    }

    confirm() {
        this.inputController.confirm();
    }

    cancel() {
        this.inputController.cancel();
    }

    openDisconnected() {
        console.log('called open disconnected modal');
        if (this.dialogRef) {
            return;
        }
        this.gameManager.stopGame();
        const disconnectedDialogConfig = new MatDialogConfig();
        disconnectedDialogConfig.autoFocus = true;
        disconnectedDialogConfig.disableClose = true;
        disconnectedDialogConfig.minWidth = 550;
        this.dialogRef = this.dialog.open(DisconnectedFromServerComponent, disconnectedDialogConfig);
        this.dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/']);
        });
        this.dialogRef.afterClosed().pipe(finalize(() => (this.dialogRef = undefined)));
        console.log(this.dialogRef);
    }
}
