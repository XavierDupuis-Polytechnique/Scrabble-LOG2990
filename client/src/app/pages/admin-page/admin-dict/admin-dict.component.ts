/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { EditDictDialogComponent } from '@app/components/modals/edit-dict/edit-dict.component';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DictHttpService } from '@app/services/dict-http.service';

export interface DictInfo {
    id: number;
    title: string;
    description: string;
    canEdit: boolean;
}

@Component({
    selector: 'app-admin-dict',
    templateUrl: './admin-dict.component.html',
    styleUrls: ['./admin-dict.component.scss'],
})
export class AdminDictComponent implements OnInit {
    listDict: Dictionary[];
    selectedFile: string;
    displayedColumns: string[] = ['position', 'name', 'weight', 'edit', 'delete'];

    dictDataSource: DictInfo[];
    dictDisplayedColumns: string[] = ['title', 'description', 'edit', 'delete'];

    constructor(private readonly dictHttpService: DictHttpService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.updateDictMap();
    }

    async loadFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        const file = input.files![0];
        this.selectedFile = '';
        const dict = await this.readFile(file);
        this.uploadDictionnary(dict);
    }

    showUpdateMenu(dict: DictInfo): void {
        this.dialog
            .open(EditDictDialogComponent, { width: '250px', data: dict })
            .afterClosed()
            .subscribe(() => {
                this.updateDictMap();
            });
    }

    deleteDict(dict: DictInfo): void {
        this.dictHttpService.delete(dict);
        this.updateDictMap();
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
                data: {
                    message: 'Erreur de lecture du fichier',
                    button1: 'Ok',
                    button2: '',
                },
            });
        } else {
            this.updateDictMap();
        }
    }

    private updateDictMap(): void {
        // REMOVE DEAD CODE
        this.dictDataSource = this.dictHttpService.getDictInfoList();
    }
}
