import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { NOT_FOUND } from '@app/game-logic/constants';
import { DictInfo } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { DictHttpService } from '@app/services/dict-http.service';

@Component({
    selector: 'app-edit-dict',
    templateUrl: './edit-dict.component.html',
    styleUrls: ['./edit-dict.component.scss'],
})
export class EditDictDialogComponent {
    dictionary: DictInfo;
    tempDict: DictInfo;

    isEditedCorrectly = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DictInfo,
        public dialogRef: MatDialogRef<EditDictDialogComponent>,
        private dictHttpService: DictHttpService,
        private dialog: MatDialog,
    ) {
        this.dictionary = { title: data.title, description: data.description, canEdit: data.canEdit };
        this.tempDict = { title: data.title, description: data.description, canEdit: data.canEdit };
    }

    uploadEdit(): void {
        if (this.tempDict.title.search('[^A-Za-z0-9 ]') !== NOT_FOUND) {
            this.errorModal('Le titre du dictionnaire contient un ou des caractères spéciaux. Ceux-ci ne sont pas permis.');
            this.isEditedCorrectly = false;
            return;
        }
        this.dictHttpService.editDict(this.dictionary, this.tempDict).subscribe(
            (res) => {
                if (res) {
                    this.close();
                    return;
                }
                this.errorModal(`Le titre du dictionnaire est déjà utilisé par un autre dictionnaire ou n'existe pas dans la base de données.
                Veuillez rafraichir la page pour obtenir la liste la plus récente des dictionnaires`);
                this.isEditedCorrectly = false;
            },
            (error: HttpErrorResponse) => {
                if (error.status === HttpStatusCode.NotFound) {
                    this.errorModal(`Le serveur n'est pas en mesure de trouver le dictionnaire que vous voulez modifier.
                    Veuillez rafraichir la page pour obtenir la liste la plus récente des dictionnaires`);
                    return;
                }
                this.errorModal('Une erreur est survenue avec le serveur, veuillez réessayer plus tard');
            },
        );
    }

    private close(): void {
        this.dialogRef.close(this.tempDict);
    }

    private errorModal(error: string) {
        this.dialog.open(AlertDialogComponent, {
            width: '400px',
            disableClose: true,
            data: {
                message: error,
                button1: 'Ok',
                button2: '',
            },
        });
    }
}
