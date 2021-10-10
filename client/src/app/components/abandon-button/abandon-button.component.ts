import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
@Component({
    selector: 'app-abandon-button',
    templateUrl: './abandon-button.component.html',
    styleUrls: ['./abandon-button.component.scss'],
})
export class AbandonButtonComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<AbandonButtonComponent>, private router: Router, private gameManager: GameManagerService) {}

    ngOnInit() {}

    // When the user clicks the action button a.k.a. the logout button in the\
    // modal, show an alert and followed by the closing of the modal
    abandon() {
        this.gameManager.stopGame();
        alert('Vous avez abandonnez la partie');
        this.router.navigate(['/home']);
        this.closeDialog();
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
