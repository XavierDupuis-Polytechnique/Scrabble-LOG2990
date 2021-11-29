import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { NOT_FOUND } from '@app/game-logic/constants';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DictHttpService } from '@app/services/dict-http.service';

@Component({
    selector: 'app-add-dict-dialog',
    templateUrl: './add-dict-dialog.component.html',
    styleUrls: ['./add-dict-dialog.component.scss'],
})
export class AddDictDialogComponent {
    selectedFile = '';

    constructor(
        public dialogRef: MatDialogRef<AddDictDialogComponent>,
        private readonly dictHttpService: DictHttpService,
        private dialog: MatDialog,
    ) {}

    showSelectedFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.selectedFile = input.files![0].name;
    }

    async uploadFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const file = input.files![0];
        this.selectedFile = '';
        const dict = await this.readFile(file);
        this.uploadDictionary(dict);
    }

    private async readFile(file: File): Promise<Dictionary> {
        const tempFileReader = new FileReader();
        return new Promise((resolve) => {
            tempFileReader.onload = (res) => {
                if(res.target === null) {
                    return;
                }
                const resultString = res.target.result;
                if (resultString === null) {
                    return;
                }
                const dictionary: Dictionary = JSON.parse(resultString.toString());
                resolve(dictionary);
            };
            tempFileReader.readAsText(file);
        });
    }

    private async uploadDictionary(dict: Dictionary) {
        if (dict.title === undefined || null) {
            this.dialog.open(AlertDialogComponent, {
                width: '250px',
                data: {
                    message: 'Le dictionnaire fournie ne contient pas de titre',
                    button1: 'Ok',
                    button2: '',
                },
            });
        } else if (dict.title.search('[^A-Za-z0-9 ]') !== NOT_FOUND) {
            this.dialog.open(AlertDialogComponent, {
                width: '250px',
                data: {
                    message: 'Le titre du dictionnaire contient un ou des caractères spéciaux. Ceux-ci ne sont pas permis.',
                    button1: 'Ok',
                    button2: '',
                },
            });
        } else if (dict.description === undefined || null) {
            this.dialog.open(AlertDialogComponent, {
                width: '250px',
                data: {
                    message: 'Le dictionnaire fournie ne contient pas de description',
                    button1: 'Ok',
                    button2: '',
                },
            });
        } else if (dict.words === undefined || null) {
            this.dialog.open(AlertDialogComponent, {
                width: '250px',
                data: {
                    message: 'Le dictionnaire fournie ne contient pas une liste de mots',
                    button1: 'Ok',
                    button2: '',
                },
            });
        } else {
            this.dictHttpService.uploadDict(dict).subscribe((value) => {
                if (!value) {
                    this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                            message: 'Un dictionnaire avec le même titre existe déjà sur le serveur',
                            button1: 'Ok',
                            button2: '',
                        },
                    });
                } else {
                    this.dialogRef.close();
                }
            });
        }
    }
}
