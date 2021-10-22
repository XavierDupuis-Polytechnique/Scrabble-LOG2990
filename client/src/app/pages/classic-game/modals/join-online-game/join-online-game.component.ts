import { AfterContentChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-join-online-game',
    templateUrl: './join-online-game.component.html',
    styleUrls: ['./join-online-game.component.scss'],
})
export class JoinOnlineGameComponent implements AfterContentChecked {
    playerName = new FormControl('', [Validators.required]);
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: string,
        private dialogRef: MatDialogRef<JoinOnlineGameComponent>,
        private cdref: ChangeDetectorRef,
    ) {}

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
}
