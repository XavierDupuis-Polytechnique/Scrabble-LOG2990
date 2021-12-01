import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ClassicGameComponent } from '@app/pages/classic-game/classic-game.component';

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
    isSoloReady: boolean = false;

    constructor(private dialogRef: MatDialogRef<LoadingGameComponent>, private classicGameComponent: ClassicGameComponent) {}

    cancel() {
        this.classicGameComponent.gameReady$$.unsubscribe();
        this.dialogRef.close();
    }
}
