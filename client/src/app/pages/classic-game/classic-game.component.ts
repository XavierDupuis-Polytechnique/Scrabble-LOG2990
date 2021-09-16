import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewSoloGameFormComponent } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';

@Component({
    selector: 'app-classic-game',
    templateUrl: './classic-game.component.html',
    styleUrls: ['./classic-game.component.scss'],
})
export class ClassicGameComponent {
    @ViewChild('gameSettingsForm') gameFormComponent: NewSoloGameFormComponent;
    hideSoloGameForm: boolean = true;
    constructor(private router: Router, private gameManager: GameManagerService, private dialog: MatDialog) {}

    openSoloGameForm() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = 50;
        // dialogConfig.panelClass=
        this.dialog.open(NewSoloGameFormComponent, dialogConfig);
        // const dialogRef = this.dialog.open(NewSoloGameFormComponent, dialogConfig);

        // dialogRef.afterClosed().subscribe((data) => console.log('Dialog output:', data));
    }

    startSoloGame() {
        console.log('startsolo');
        const gameSettings = this.gameFormComponent.settings;
        this.gameManager.createGame(gameSettings);
        this.router.navigate(['/game']);
    }
}
