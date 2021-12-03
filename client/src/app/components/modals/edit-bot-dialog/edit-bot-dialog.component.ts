import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NOT_ONLY_SPACE_RGX } from '@app/game-logic/constants';
import { openErrorDialog } from '@app/game-logic/utils';
import { BotHttpService, BotInfo } from '@app/services/bot-http.service';

const ERROR_BOT_NAME_ALREADY_USED = 'Le nom du joueur virtuel est déjà utilisé';
const ERROR_BOT_NOT_FOUND = `Le serveur n'est pas en mesure de trouver le joueur virtuel que vous voulez modifier.
Veuillez rafraichir la page pour obtenir la liste la plus récente des joueurs virtuels`;
@Component({
    selector: 'app-edit-bot-dialog',
    templateUrl: './edit-bot-dialog.component.html',
    styleUrls: ['./edit-bot-dialog.component.scss'],
})
export class EditBotDialogComponent {
    bot: BotInfo;
    editBotInfo: BotInfo;
    isEdit: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: BotInfo,
        private readonly botHttpService: BotHttpService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<EditBotDialogComponent>,
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
                    this.openErrorModal(ERROR_BOT_NAME_ALREADY_USED);
                } else this.dialogRef.close();
            },
            (err: HttpErrorResponse) => {
                if (err.status === HttpStatusCode.NotFound) {
                    this.openErrorModal(ERROR_BOT_NOT_FOUND);
                }
            },
        );
    }

    addBot() {
        this.botHttpService.addBot(this.bot).subscribe((res) => {
            const ans = JSON.parse(res.toString());
            if (!ans) {
                this.openErrorModal(ERROR_BOT_NAME_ALREADY_USED);
            } else this.dialogRef.close();
        });
    }

    private openErrorModal(errorContent: string) {
        openErrorDialog(this.dialog, '250px', errorContent);
    }

    get isValuesValid() {
        return this.bot.name && this.bot.type && NOT_ONLY_SPACE_RGX.test(this.bot.name);
    }
}
