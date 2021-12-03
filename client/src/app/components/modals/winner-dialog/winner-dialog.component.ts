import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface WinnerDialogData {
    winnerNames: string[];
    isWinner: boolean;
}

@Component({
    templateUrl: './winner-dialog.component.html',
    styleUrls: ['./winner-dialog.component.scss'],
})
export class WinnerDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public winnerData: WinnerDialogData, private dialogRef: MatDialogRef<WinnerDialogComponent>) {}

    getWinnerMessage(): string {
        const winnerNames = this.winnerData.winnerNames;
        if (winnerNames.length !== 1) {
            return `Les gagnants de la partie sont ${winnerNames[0]} et ${winnerNames[1]}`;
        }
        return `Le gagnant de la partie est ${winnerNames[0]}`;
    }

    getCongratulationMessage(): string {
        const userIsWinner = this.winnerData.isWinner;
        if (userIsWinner) {
            return 'Félicitation!';
        }
        return 'Dommage...';
    }

    close() {
        this.dialogRef.close();
    }
}
