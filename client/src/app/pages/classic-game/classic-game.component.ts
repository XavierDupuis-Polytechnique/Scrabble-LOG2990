import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewSoloGameFormComponent } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { GameSettings } from '@app/GameLogic/game/games/game-settings.interface';
import { OnlineGameSettings } from '@app/modeMulti/interface/game-settings-multi.interface';
import { UserAuth } from '@app/modeMulti/interface/user-auth.interface';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
import { NewOnlineGameFormComponent } from '@app/pages/classic-game/modals/new-online-game-form/new-online-game-form.component';
import { PendingGamesComponent } from '@app/pages/classic-game/modals/pending-games/pending-games.component';
import { WaitingForPlayerComponent } from '@app/pages/classic-game/modals/waiting-for-player/waiting-for-player.component';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'app-classic-game',
    templateUrl: './classic-game.component.html',
    styleUrls: ['./classic-game.component.scss'],
})
export class ClassicGameComponent {
    gameSettings: GameSettings;
    startGame$$: Subscription;
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
        });
    }

    openMultiGameForm() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = 60;

        const dialogRef = this.dialog.open(NewOnlineGameFormComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((formOnline: GameSettings) => {
            if (!formOnline) {
                return;
            }
            // TODO:Socket validator
            this.gameSettings = formOnline;
            this.socketHandler.createGameMulti(formOnline);
            const username = formOnline.playerName;
            this.openWaitingForPlayer(username);
        });
    }

    openWaitingForPlayer(username: string) {
        const secondDialogConfig = new MatDialogConfig();
        secondDialogConfig.autoFocus = true;
        secondDialogConfig.disableClose = true;

        const secondDialogRef = this.dialog.open(WaitingForPlayerComponent, secondDialogConfig);
        secondDialogRef.afterOpened().subscribe(() => {
            this.startGame$$?.unsubscribe();
            this.startGame$$ = this.socketHandler.startGame$.pipe(takeWhile((val) => !val, true)).subscribe((gameSettings) => {
                if (!gameSettings) {
                    return;
                }
                this.dialog.closeAll();
                this.startOnlineGame(username, gameSettings);
            });
        });
        secondDialogRef.afterClosed().subscribe((botDifficulty) => {
            if (botDifficulty) {
                this.socketHandler.disconnectSocket();
                this.gameSettings = {
                    playerName: this.gameSettings.playerName,
                    botDifficulty,
                    randomBonus: this.gameSettings.randomBonus,
                    timePerTurn: this.gameSettings.timePerTurn,
                };
                this.startSoloGame();
            }
        });
    }

    openPendingGames() {
        const pendingGamesDialogConfig = new MatDialogConfig();
        pendingGamesDialogConfig.autoFocus = true;
        pendingGamesDialogConfig.disableClose = true;
        pendingGamesDialogConfig.minWidth = 550;
        const dialogRef = this.dialog.open(PendingGamesComponent, pendingGamesDialogConfig);
        dialogRef.afterClosed().subscribe((name: string) => {
            this.startGame$$?.unsubscribe();
            this.startGame$$ = this.socketHandler.startGame$.pipe(takeWhile((val) => !val, true)).subscribe((onlineGameSettings) => {
                if (!onlineGameSettings) {
                    return;
                }
                this.startOnlineGame(name, onlineGameSettings);
            });
        });
    }

    startOnlineGame(userName: string, onlineGameSettings: OnlineGameSettings) {
        const gameToken = onlineGameSettings.id;
        const userAuth: UserAuth = { playerName: userName, gameToken };
        this.socketHandler.resetGameToken();
        this.gameManager.joinOnlineGame(userAuth, onlineGameSettings);
        this.router.navigate(['/game']);
    }

    startSoloGame() {
        this.gameManager.createGame(this.gameSettings);
        this.router.navigate(['/game']);
    }
}
