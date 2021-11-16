import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DataDialog {
    message: string;
    button1: string;
    button2: string;
}

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: DataDialog) {}
}
