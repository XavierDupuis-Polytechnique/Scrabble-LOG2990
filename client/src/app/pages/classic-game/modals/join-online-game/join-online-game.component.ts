import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '@app/GameLogic/constants';
import { ErrorDialogComponent } from '@app/pages/classic-game/modals/error-dialog/error-dialog.component';
import { OnlineGameSettings } from '@app/socket-handler/mode-multi/interface/game-settings-multi.interface';
import { OnlineGameInitService } from '@app/socket-handler/mode-multi/online-game-init.service';
const NO_WHITE_SPACE_RGX = /^\S*$/;
@Component({
    selector: 'app-join-online-game',
    templateUrl: './join-online-game.component.html',
    styleUrls: ['./join-online-game.component.scss'],
})
export class JoinOnlineGameComponent implements AfterContentChecked, OnInit {
    playerName: string;
    oppName: FormControl;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: OnlineGameSettings,
        private dialogRef: MatDialogRef<JoinOnlineGameComponent>,
        private dialog: MatDialog,
        private cdref: ChangeDetectorRef,
        private onlineSocketHandler: OnlineGameInitService,
    ) {}
    ngOnInit() {
        this.playerName = this.data.playerName;
        this.oppName = new FormControl('', [
            Validators.required,
            Validators.minLength(MIN_NAME_LENGTH),
            Validators.maxLength(MAX_NAME_LENGTH),
            Validators.pattern(NO_WHITE_SPACE_RGX),
            this.forbiddenNameValidator(),
        ]);
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    cancel(): void {
        this.dialogRef.close();
        this.oppName.reset();
    }

    sendParameter(): void {
        this.dialogRef.close(this.oppName.value);
        this.onlineSocketHandler.joinPendingGame(this.data.id, this.oppName.value);
        this.onlineSocketHandler.error$.subscribe((error: string) => {
            if (error) {
                this.dialog.open(ErrorDialogComponent, { disableClose: true, autoFocus: true, data: error });
            }
        });
    }

    forbiddenNameValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: unknown } | null =>
            control.value !== this.playerName ? null : { forbidden: control.value };
    }

    get valid() {
        return this.oppName.valid;
    }

    get randomBonusType() {
        return this.data.randomBonus === true ? 'est activé' : 'est désactivé';
    }
}
