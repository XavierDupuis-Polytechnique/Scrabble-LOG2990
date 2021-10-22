import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameSettingsMulti } from '@app/modeMulti/interface/game-settings-multi.interface';

@Component({
    selector: 'app-join-online-game',
    templateUrl: './join-online-game.component.html',
    styleUrls: ['./join-online-game.component.scss'],
})
export class JoinOnlineGameComponent implements AfterContentChecked, OnInit {
    playerName: FormControl;
    oppName: string;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: GameSettingsMulti,
        private dialogRef: MatDialogRef<JoinOnlineGameComponent>,
        private cdref: ChangeDetectorRef,
    ) {}
    ngOnInit() {
        this.oppName = this.data.playerName;
        this.playerName = new FormControl('', [Validators.required, this.forbiddenNameValidator(this.oppName)]);
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    cancel(): void {
        this.dialogRef.close();
        this.playerName.reset();
    }

    sendParameter(): void {
        this.dialogRef.close(this.playerName.value);
    }

    get valid() {
        return this.playerName.valid;
    }

    // TODO
    forbiddenNameValidator(nameRe: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: unknown } | null => (nameRe === this.oppName ? null : { forbiddenName: control.value });
    }
}
