import { AfterContentChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConvertToSoloFormComponent } from '@app/pages/classic-game/convert-to-solo-form/convert-to-solo-form.component';
const SPINNER_WIDTH_STROKE = 7;
const SPINNER_DIAMETER = 40;
@Component({
    selector: 'app-waiting-for-player',
    templateUrl: './waiting-for-player.component.html',
    styleUrls: ['./waiting-for-player.component.scss'],
})
export class WaitingForPlayerComponent implements AfterContentChecked {
    spinnerStrokeWidth = SPINNER_WIDTH_STROKE;
    spinnerDiameter = SPINNER_DIAMETER;
    botDifficulty: string;
    startSolo: boolean = false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: string,
        private dialogRef: MatDialogRef<WaitingForPlayerComponent>,
        private dialog: MatDialog,
        private cdref: ChangeDetectorRef,
    ) {}

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    convertToModeSolo() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;

        const botDifficultyForm = this.dialog.open(ConvertToSoloFormComponent, dialogConfig);
        botDifficultyForm.afterClosed().subscribe((result: string) => {
            if (result) {
                this.botDifficulty = result;
                this.startSolo = true;
                this.dialogRef.close(this.botDifficulty);
                console.log('closing:', this.botDifficulty);
            } else {
                console.log('Waiting for second player');
            }
        });
    }
}
