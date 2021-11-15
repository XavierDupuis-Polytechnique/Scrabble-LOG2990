import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { BotInfo, JvHttpService } from '@app/services/jv-http.service';

@Component({
    selector: 'app-edit-jv-dialog',
    templateUrl: './edit-jv-dialog.component.html',
    styleUrls: ['./edit-jv-dialog.component.scss'],
})
export class EditJvDialogComponent {
    bot: BotInfo;
    editBotInfo: BotInfo;
    isEdit: boolean = false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: BotInfo,
        private readonly jvHttpService: JvHttpService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<EditJvDialogComponent>,
    ) {
        this.bot = { name: data.name, type: data.type, canEdit: data.canEdit };
        this.editBotInfo = { name: data.name, type: data.type, canEdit: data.canEdit };
        this.isEdit = data.canEdit;
    }

    editBot() {
        this.jvHttpService.editBot(this.editBotInfo, this.bot).subscribe((res) => {
            const ans = JSON.parse(res.toString());
            if (ans === false) {
                this.dialog.open(AlertDialogComponent, {
                    width: '250px',
                    data: 'Le nom du joueur virtuel est déjà utilisé',
                });
            } else this.dialogRef.close();
        });
    }

    addBot() {
        this.jvHttpService.addBot(this.bot).subscribe((res) => {
            const ans = JSON.parse(res.toString());
            if (ans === false) {
                this.dialog.open(AlertDialogComponent, {
                    width: '250px',
                    data: 'Le nom du joueur virtuel est déjà utilisé',
                });
            } else this.dialogRef.close();
        });
    }
}