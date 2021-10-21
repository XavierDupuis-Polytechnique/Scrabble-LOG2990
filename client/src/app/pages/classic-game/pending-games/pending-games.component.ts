import { AfterContentChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameSettingsMultiUI } from '@app/modeMulti/interface/game-settings-multi.interface';

@Component({
    selector: 'app-pending-games',
    templateUrl: './pending-games.component.html',
    styleUrls: ['./pending-games.component.scss'],
})
export class PendingGamesComponent implements AfterContentChecked {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: GameSettingsMultiUI,
        private dialogRef: MatDialogRef<PendingGamesComponent>,
        private cdref: ChangeDetectorRef,
    ) {}

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
