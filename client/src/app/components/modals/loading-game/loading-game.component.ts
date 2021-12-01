import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

const SPINNER_WIDTH_STROKE = 7;
const SPINNER_DIAMETER = 40;

@Component({
    selector: 'app-loading-game',
    templateUrl: './loading-game.component.html',
    styleUrls: ['./loading-game.component.scss'],
})
export class LoadingGameComponent {
    spinnerStrokeWidth = SPINNER_WIDTH_STROKE;
    spinnerDiameter = SPINNER_DIAMETER;
    isCanceled: boolean;

    constructor(private dialogRef: MatDialogRef<LoadingGameComponent>) {
        this.isCanceled = false;
    }

    cancel() {
        this.isCanceled = true;
        this.dialogRef.close(this.isCanceled);
    }
}
