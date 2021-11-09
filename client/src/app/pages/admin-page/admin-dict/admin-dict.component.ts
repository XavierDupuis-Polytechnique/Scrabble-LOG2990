import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    isFileEmpty: boolean = true;
    constructor(private readonly dictHttpService: DictHttpService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.dictMap = new Map<number, Dictionary>();
        const tempList = this.dictHttpService.getListDict();

        tempList.forEach((dict) => {
            if (dict.id) {
                this.dictMap.set(dict.id, dict);
            }
        });
    }

    async loadFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        this.isFileEmpty = true;
        if (input.files) {
            const file = input.files[0];
            const dict = await this.readFile(file);

            if (dict) {
                this.uploadDictionnary(dict);
            }
        }
    }

    showUpdateMenu(dict: Dictionary): void {
        this.dialog
            .open(EditDictDialogComponent, {
                width: '400px',
                data: dict,
            })
            .afterClosed()
            .subscribe((result: Dictionary) => {
                // TODO remove result.id in if when dictionnary interface is fully implemented
                if (result && result.id) {
                    const tes = this.dictMap.get(result.id);
                    if (tes) tes.title = result.title;
                }
            });
    }

    showSelectedFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        if (input.files) {
            this.selectedFile = input.files[0].name;
            this.isFileEmpty = false;
        }
    }

    private async readFile(file: File): Promise<Dictionary> {
        const tempFileReader = new FileReader();
        return new Promise((resolve, reject) => {
            tempFileReader.onerror = () => {
                reject();
            };

            tempFileReader.onload = (res) => {
                const resultString = res.target?.result;
                if (resultString) {
                    const dictionary: Dictionary = JSON.parse(resultString?.toString());
                    resolve(dictionary);
                } else {
                    reject();
                }
            };
            tempFileReader.readAsText(file);
        });
    }

    private uploadDictionnary(dict: Dictionary): void {
        this.dictHttpService.uploadDict(dict);
    }
}
