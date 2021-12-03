import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAX_FILE_LENGTH } from '@app/game-logic/constants';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DictInfo } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DictHttpService {
    constructor(private http: HttpClient) {}

    getDict(dictTitle: string) {
        const title = dictTitle.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH);
        return this.http.get(`${environment.serverUrl}/dictionary?title=${title}`);
    }

    getDictInfoList() {
        return this.http.get(`${environment.serverUrl}/dictionary`);
    }

    uploadDict(dict: Dictionary) {
        return this.http.post(`${environment.serverUrl}/dictionary`, dict);
    }

    editDict(oldDict: DictInfo, newDict: DictInfo) {
        return this.http.put(`${environment.serverUrl}/dictionary`, [oldDict, newDict]);
    }

    deleteDict(dictTitle: string) {
        const title = dictTitle.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH);
        return this.http.delete(`${environment.serverUrl}/dictionary?title=${title}`, { responseType: 'text' });
    }

    dropTable() {
        return this.http.get(`${environment.serverUrl}/dictionary/drop`);
    }
}
