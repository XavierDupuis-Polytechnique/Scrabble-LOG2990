import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DictHttpService } from '@app/services/dict-http.service';

@Component({
    selector: 'app-edit-dict',
    templateUrl: './edit-dict.component.html',
    styleUrls: ['./edit-dict.component.scss'],
})
export class EditDictDialogComponent {
    dictionary: Dictionary;
    tempDict: Dictionary;

    isEditedCorrectly = true;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Dictionary,
        public dialogRef: MatDialogRef<EditDictDialogComponent>,
        private dictHttpService: DictHttpService,
        private dialog: MatDialog,
    ) {
        this.dictionary = { title: data.title, description: data.description, words: data.words, id: data.id };
        this.tempDict = { title: data.title, description: data.description, words: data.words, id: data.id };
    }

    uploadEdit(): void {
        if (this.dictHttpService.editDict(this.tempDict)) {
            this.close();
        } else {
            this.isEditedCorrectly = false;
            this.tempDict = this.dictionary;
        }
    }

    close(): void {
        this.dialogRef.close(this.tempDict);
    }

    delete(): void {
        if (!this.dictHttpService.delete(this.dictionary)) {
            this.dialog.open(AlertDialogComponent, { width: '400px', disableClose: true });
        }
    }
}
