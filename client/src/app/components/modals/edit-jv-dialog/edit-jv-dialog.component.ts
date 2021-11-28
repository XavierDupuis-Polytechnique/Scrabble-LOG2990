import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { BotHttpService, BotInfo } from '@app/services/jv-http.service';

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
        private readonly botHttpService: BotHttpService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<EditJvDialogComponent>,
    ) {
        this.bot = { name: data.name, type: data.type, canEdit: data.canEdit };
        this.editBotInfo = { name: data.name, type: data.type, canEdit: data.canEdit };
        this.isEdit = data.canEdit;
    }

    editBot() {
        this.botHttpService.editBot(this.editBotInfo, this.bot).subscribe(
            (res) => {
                const ans = JSON.parse(res.toString());
                if (!ans) {
                    this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                            message: 'Le nom du joueur virtuel est déjà utilisé',
                            button1: 'Ok',
                            button2: '',
                        },
                    });
                } else this.dialogRef.close();
            },
            (err: HttpErrorResponse) => {
                if (err.status === HttpStatusCode.NotFound) {
                    this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                            message: `Le serveur n'est pas en mesure de trouver le joueur virtuel que vous voulez modifier.
                        Veuillez rafraichir la page pour obtenir la liste la plus récente des joueurs virtuels`,
                            button1: 'Ok',
                            button2: '',
                        },
                    });
                }
            },
        );
    }

    addBot() {
        this.botHttpService.addBot(this.bot).subscribe((res) => {
            const ans = JSON.parse(res.toString());
            if (ans === false) {
                this.dialog.open(AlertDialogComponent, {
                    width: '250px',
                    data: {
                        message: 'Le nom du joueur virtuel est déjà utilisé',
                        button1: 'Ok',
                        button2: '',
                    },
                });
            } else this.dialogRef.close();
        });
    }
}
