import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewSoloGameFormComponent } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';

@Component({
    selector: 'app-classic-game',
    templateUrl: './classic-game.component.html',
    styleUrls: ['./classic-game.component.scss'],
})
export class ClassicGameComponent {
    gameSettings: NewSoloGameFormComponent;
    dialogRef: MatDialogRef<NewSoloGameFormComponent>;

    constructor(private router: Router, private gameManager: GameManagerService, private dialog: MatDialog) {}
    openSoloGameForm() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = 50;

        this.dialog.open(NewSoloGameFormComponent, dialogConfig);
        const dialogRef = this.dialog.open(NewSoloGameFormComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
            try {
                this.gameSettings = result;
                this.startSoloGame();
            } catch (e) {
                this.closeSoloGameForm();
            }
        });
    }
    closeSoloGameForm() {
        this.dialog.closeAll();
    }

    startSoloGame(): any {
        this.closeSoloGameForm();
        this.gameManager.createGame(this.gameSettings);
        this.router.navigate(['/game']);
    }
}
