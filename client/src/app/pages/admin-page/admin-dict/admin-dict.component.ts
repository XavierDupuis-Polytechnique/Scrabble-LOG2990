/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { EditDictDialogComponent } from '@app/components/modals/edit-dict/edit-dict.component';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DictHttpService } from '@app/services/dict-http.service';

@Component({
    selector: 'app-admin-dict',
    templateUrl: './admin-dict.component.html',
    styleUrls: ['./admin-dict.component.scss'],
})
export class AdminDictComponent implements OnInit {
    dictMap: Map<number, Dictionary>;

    selectedFile: string;

    constructor(private readonly dictHttpService: DictHttpService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.dictMap = new Map<number, Dictionary>();
        this.updateDictMap();
    }

    async loadFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        const file = input.files![0];
        this.selectedFile = '';
        const dict = await this.readFile(file);
        this.uploadDictionnary(dict);
    }

    showUpdateMenu(dict: Dictionary): void {
        const defaultDictId = 1;
        if (dict.id !== defaultDictId) {
            this.dialog
                .open(EditDictDialogComponent, {
                    width: '400px',
                    data: dict,
                })
                .afterClosed()
                .subscribe((result: Dictionary) => {
                    const tes = this.dictMap.get(result.id!);
                    tes!.title = result.title;
                });
        }
    }

    showSelectedFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        this.selectedFile = input.files![0].name;
    }

    private async readFile(file: File): Promise<Dictionary> {
        const tempFileReader = new FileReader();
        return new Promise((resolve) => {
            tempFileReader.onload = (res) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const resultString = res.target!.result;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const dictionary: Dictionary = JSON.parse(resultString!.toString());
                resolve(dictionary);
            };
            tempFileReader.readAsText(file);
        });
    }

    private uploadDictionnary(dict: Dictionary): void {
        if (!this.dictHttpService.uploadDict(dict)) {
            this.dialog.open(AlertDialogComponent, {
                width: '250px',
                data: 'Erreur de lecture du fichier',
            });
        } else {
            this.updateDictMap();
        }
    }

    private updateDictMap(): void {
        const tempDictList = this.dictHttpService.getListDict();

        tempDictList.forEach((dict) => {
            this.dictMap.set(dict.id!, dict);
        });
    }
}
