import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewSoloGameFormComponent } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { GameSettings } from '@app/GameLogic/game/games/game-settings.interface';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
import { NewOnlineGameFormComponent } from '@app/pages/classic-game/new-online-game-form/new-online-game-form.component';
import { PendingGamesComponent } from '@app/pages/classic-game/pending-games/pending-games.component';
import { WaitingForPlayerComponent } from '@app/pages/classic-game/waiting-for-player/waiting-for-player.component';

@Component({
    selector: 'app-classic-game',
    templateUrl: './classic-game.component.html',
    styleUrls: ['./classic-game.component.scss'],
})
export class ClassicGameComponent {
    gameSettings: GameSettings;

    constructor(
        private router: Router,
        private gameManager: GameManagerService,
        private dialog: MatDialog,
        private socketHandler: OnlineGameInitService,
    ) {}

    openSoloGameForm() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = 60;

        const dialogRef = this.dialog.open(NewSoloGameFormComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((formSolo) => {
            if (!formSolo) {
                return;
            }
            this.gameSettings = formSolo;
            this.startSoloGame();
            // eslint-disable-next-line no-empty
        });
    }

    openMultiGameForm() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = 60;

        const dialogRef = this.dialog.open(NewOnlineGameFormComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((formOnline) => {
            if (!formOnline) {
                return;
            }
            // TODO:Socket validator
            this.gameSettings = formOnline;
            this.socketHandler.connect();
            this.socketHandler.createGameMulti(formOnline);
            this.socketHandler.waitForSecondPLayer();
            this.openWaitingForPlayer();
        });
    }
    openWaitingForPlayer() {
        const secondDialogConfig = new MatDialogConfig();
        secondDialogConfig.autoFocus = true;
        secondDialogConfig.disableClose = true;
        // secondDialogConfig.minWidth = 60;
        const secondDialogRef = this.dialog.open(WaitingForPlayerComponent, secondDialogConfig);
        secondDialogRef.afterClosed().subscribe((botDifficulty) => {
            if (!botDifficulty) {
                // botDifficulty = vide
                return;
            }
            this.socketHandler.disconnect();
            this.gameSettings = {
                playerName: this.gameSettings.playerName,
                botDifficulty,
                randomBonus: this.gameSettings.randomBonus,
                timePerTurn: this.gameSettings.timePerTurn,
            };
            console.log('ClassicComponentGameSettings', this.gameSettings);
            this.startSoloGame();
        });
    }

    openPendingGames() {
        const pendingGamesDialogConfig = new MatDialogConfig();
        pendingGamesDialogConfig.autoFocus = true;
        pendingGamesDialogConfig.disableClose = true;
        pendingGamesDialogConfig.minWidth = 750;
        this.dialog.open(PendingGamesComponent, pendingGamesDialogConfig);
    }

    startSoloGame() {
        this.gameManager.createGame(this.gameSettings);
        this.router.navigate(['/game']);
    }
}
