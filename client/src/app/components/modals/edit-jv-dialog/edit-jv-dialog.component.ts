import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { BotInfo, JvHttpService } from '@app/services/jv-http.service';

interface DialogData {
    dialogBot: BotInfo;
    isEdit: boolean;
}

@Component({
    selector: 'app-edit-jv-dialog',
    templateUrl: './edit-jv-dialog.component.html',
    styleUrls: ['./edit-jv-dialog.component.scss'],
})
export class EditJvDialogComponent {
    bot: BotInfo;
    isEdit: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private readonly jvHttpService: JvHttpService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<EditJvDialogComponent>,
    ) {
        this.bot = { name: data.dialogBot.name, type: data.dialogBot.type, canEdit: data.dialogBot.canEdit, id: data.dialogBot.id };
        this.isEdit = data.isEdit;
    }
    // TODO changer les message d'alert
    editBot() {
        if (!this.jvHttpService.editBot(this.bot)) {
            this.dialog.open(AlertDialogComponent, {
                width: '250px',
                data: 'Un problème est survenue. Veuillez réessayer',
            });
        } else {
            this.dialogRef.close();
        }
    }

    addBot() {
        if (!this.jvHttpService.addBot(this.bot)) {
            this.dialog.open(AlertDialogComponent, {
                width: '250px',
                data: 'Un problème est survenue. Veuillez réessayer',
            });
        } else {
            this.dialogRef.close();
        }
    }
}
