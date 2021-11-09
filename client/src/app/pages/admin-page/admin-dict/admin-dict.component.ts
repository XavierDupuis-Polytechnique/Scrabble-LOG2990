import { Component, OnInit } from '@angular/core';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DictHttpService } from '@app/services/dict-http.service';

@Component({
    selector: 'app-admin-dict',
    templateUrl: './admin-dict.component.html',
    styleUrls: ['./admin-dict.component.scss'],
})
export class AdminDictComponent implements OnInit {
    listDict: Dictionary[];
    constructor(private readonly dictHttpService: DictHttpService) {}

    ngOnInit(): void {
        this.listDict = this.dictHttpService.getListDict();
    }

    loadFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        if (input.files) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (res) => {
                const resultString = res.target?.result;
                if (resultString) {
                    const dictionary: Dictionary = JSON.parse(resultString?.toString());
                    this.dictHttpService.uploadDict(dictionary);
                }
            };
            reader.readAsText(file);
        }
    }

    showUpdateMenu(dict: Dictionary) {
        console.log('show update menu', dict);
    }
}
