import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewOnlineGameFormComponent } from '@app/components/modals/new-online-game-form/new-online-game-form.component';
import { NewSoloGameFormComponent } from '@app/components/modals/new-solo-game-form/new-solo-game-form.component';
import { PendingGamesComponent } from '@app/components/modals/pending-games/pending-games.component';
import { WaitingForPlayerComponent } from '@app/components/modals/waiting-for-player/waiting-for-player.component';
import { GameManagerService } from '@app/game-logic/game/games/game-manager/game-manager.service';
import { GameSettings } from '@app/game-logic/game/games/game-settings.interface';
import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';
import { OnlineGameSettings, OnlineGameSettingsUI } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { UserAuth } from '@app/socket-handler/interfaces/user-auth.interface';
import { NewOnlineGameSocketHandler } from '@app/socket-handler/new-online-game-socket-handler/new-online-game-socket-handler.service';
import { Subscription } from 'rxjs';
import { first, takeWhile } from 'rxjs/operators';
//125,147,159-162
// TODO: change name to new-game-component (page)
@Component({
    selector: 'app-classic-game',
    templateUrl: './classic-game.component.html',
    styleUrls: ['./classic-game.component.scss'],
})
export class ClassicGameComponent {
    gameSettings: GameSettings;
    startGame$$: Subscription;
    gameMode = GameMode.Classic;

    constructor(
        private router: Router,
        private gameManager: GameManagerService,
        private dialog: MatDialog,
        private socketHandler: NewOnlineGameSocketHandler,
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
            this.gameSettings = formOnline;
            const onlineGameSettings: OnlineGameSettingsUI = {
                gameMode: this.gameMode,
                timePerTurn: formOnline.timePerTurn,
                playerName: formOnline.playerName,
                randomBonus: formOnline.randomBonus,
            };
            this.socketHandler.createGameMulti(onlineGameSettings);
            const username = formOnline.playerName;
            this.openWaitingForPlayer(username);
        });
    }

    openWaitingForPlayer(username: string) {
        this.startGame$$?.unsubscribe();
        const secondDialogConfig = new MatDialogConfig();
        secondDialogConfig.autoFocus = true;
        secondDialogConfig.disableClose = true;

        const secondDialogRef = this.dialog.open(WaitingForPlayerComponent, secondDialogConfig);
        secondDialogRef.afterOpened().subscribe(() => {
            this.socketHandler.isDisconnected$.subscribe((isDisconnected) => {
                if (isDisconnected) {
                    secondDialogRef.close();
                    this.socketHandler.disconnectSocket();
                }
            });
            this.startGame$$ = this.socketHandler.startGame$.pipe(takeWhile((val) => !val, true)).subscribe((gameSettings) => {
                if (!gameSettings) {
                    return;
                }
                secondDialogRef.close();
                this.startOnlineGame(username, gameSettings);
                this.socketHandler.disconnectSocket();
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
        this.startGame$$?.unsubscribe();
        const pendingGamesDialogConfig = new MatDialogConfig();
        pendingGamesDialogConfig.autoFocus = true;
        pendingGamesDialogConfig.disableClose = true;
        pendingGamesDialogConfig.minWidth = 550;
        pendingGamesDialogConfig.data = this.gameMode;
        const dialogRef = this.dialog.open(PendingGamesComponent, pendingGamesDialogConfig);
        dialogRef
            .afterClosed()
            .pipe(first())
            .subscribe((name: string) => {
                if (!name) {
                    return;
                }
                this.startGame$$ = this.socketHandler.startGame$.pipe(takeWhile((val) => !val, true)).subscribe((onlineGameSettings) => {
                    if (!onlineGameSettings) {
                        return;
                    }
                    this.startOnlineGame(name, onlineGameSettings);
                    this.socketHandler.disconnectSocket();
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
        if (this.isSpecialGame) {
            this.gameManager.createSpecialGame(this.gameSettings);
        } else {
            this.gameManager.createGame(this.gameSettings);
        }
        this.router.navigate(['/game']);
    }

    get isSpecialGame() {
        return this.gameMode === GameMode.Special;
    }

    set isSpecialGame(value: boolean) {
        if (value) {
            this.gameMode = GameMode.Special;
        } else {
            this.gameMode = GameMode.Classic;
        }
    }
}
