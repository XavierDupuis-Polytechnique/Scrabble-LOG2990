import { AfterContentChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: string,
        // private dialogRef: MatDialogRef<WaitingForPlayerComponent>,
        private dialog: MatDialog,
        private cdref: ChangeDetectorRef,
    ) {}

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    convertToModeSolo() {
        this.openBotSelection();
    }

    openBotSelection() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        // dialogConfig.disableClose = true;

        let botDifficulty: string;
        const botDifficultyForm = this.dialog.open(ConvertToSoloFormComponent, dialogConfig);
        botDifficultyForm.afterClosed().subscribe((result: string) => {
            if (result) {
                botDifficulty = result;
                console.log('sentTOClassic', botDifficulty);
            }
        });
    }
}
