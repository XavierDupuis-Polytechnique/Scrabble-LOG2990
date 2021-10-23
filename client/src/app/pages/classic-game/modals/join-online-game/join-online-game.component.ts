import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '@app/GameLogic/constants';
import { GameSettingsMulti } from '@app/modeMulti/interface/game-settings-multi.interface';
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
        @Inject(MAT_DIALOG_DATA) public data: GameSettingsMulti,
        private dialogRef: MatDialogRef<JoinOnlineGameComponent>,
        private cdref: ChangeDetectorRef,
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
    }

    get valid() {
        return this.oppName.valid;
    }

    forbiddenNameValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: unknown } | null =>
            control.value?.toLowerCase() !== this.playerName ? null : { forbidden: control.value };
    }
}
