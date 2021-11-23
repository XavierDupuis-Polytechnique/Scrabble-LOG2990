import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameManagerService } from '@app/game-logic/game/games/game-manager/game-manager.service';
@Component({
    selector: 'app-abandon-button',
    templateUrl: './abandon-button.component.html',
    styleUrls: ['./abandon-button.component.scss'],
})
export class AbandonButtonComponent {
    constructor(private dialogRef: MatDialogRef<AbandonButtonComponent>, private router: Router, private gameManager: GameManagerService) {}

    abandon() {
        this.gameManager.stopGame();
        this.router.navigate(['/home']);
        this.closeDialog();
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
