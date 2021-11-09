import { Injectable } from '@angular/core';
import { Dictionary } from '@app/game-logic/validator/dictionary';

@Injectable({
    providedIn: 'root',
})
export class DictHttpService {
    // TODO create and return HTTP request to the server
    getListDict(): Dictionary[] {
        return [
            { title: 'French', description: 'Dictionnaire francais', words: ['wow'], id: 1 },
            { title: 'English', description: 'Dictionnaire anglais', words: ['wow'], id: 2 },
        ];
    }

    // TODO create POST HTTP request to the server
    uploadDict(dict: Dictionary): void {
        console.log(dict);
    }
    // TODO create PUT HTTP request to the server
    editDict(dict: Dictionary): boolean {
        return true;
    }
    // TODO create DELETE HTTP request to the server
    delete(dict: Dictionary): boolean {
        return false;
    }
}
