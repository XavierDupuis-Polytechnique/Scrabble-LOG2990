/* eslint-disable no-unused-vars */
import { Injectable } from '@angular/core';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DictInfo } from '@app/pages/admin-page/admin-dict/admin-dict.component';

@Injectable({
    providedIn: 'root',
})
export class DictHttpService {
    templist: Dictionary[] = [
        { title: 'French', description: 'Dictionnaire francais', words: ['wow'], id: 1 },
        { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 2 },
        { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 3 },
        { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 4 },
        { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 5 },
        { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 6 },
        { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 7 },
        { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 8 },
        { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 9 },
        { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 10 },
        { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 11 },
    ];
    // TODO create and return HTTP request to the server
    getListDict(): Dictionary[] {
        return this.templist;
    }

    // TODO create and return HTTP request to the server
    getDictInfoList(): DictInfo[] {
        return [
            { title: 'Francais', description: 'test', canEdit: false, id: 1 },
            { title: 'Francais', description: 'test', canEdit: true, id: 2 },
            { title: 'Francais', description: 'test', canEdit: true, id: 2 },
            { title: 'Francais', description: 'test', canEdit: true, id: 2 },
            { title: 'Francais', description: 'test', canEdit: true, id: 2 },
            { title: 'Francais', description: 'test', canEdit: true, id: 2 },
            { title: 'Francais', description: 'test', canEdit: true, id: 2 },
        ];
    }
    // TODO create POST HTTP request to the server
    uploadDict(dict: Dictionary): boolean {
        return true;
    }
    // TODO create PUT HTTP request to the server
    editDict(dict: DictInfo): boolean {
        return true;
    }
    // TODO create DELETE HTTP request to the server
    delete(dict: DictInfo): boolean {
        return false;
    }

    dropTable() {
        return true;
    }
}
