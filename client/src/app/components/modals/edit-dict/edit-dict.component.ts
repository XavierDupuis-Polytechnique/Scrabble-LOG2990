import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
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
        this.dictHttpService.editDict(this.dictionary, this.tempDict).subscribe((res) => {
            if (res) {
                this.close();
            } else {
                this.dialog.open(AlertDialogComponent, {
                    width: '400px',
                    disableClose: true,
                    data: {
                        message: 'Le titre du dictionnaire est déjà utilisé par un autre dictionnaire',
                        button1: 'Ok',
                        button2: '',
                    },
                });
                this.isEditedCorrectly = false;
                this.tempDict = this.dictionary;
            }
        });
    }

    private close(): void {
        this.dialogRef.close(this.tempDict);
    }
}
