import { Injectable } from '@angular/core';
import { Dictionary } from '@app/game-logic/validator/dictionary';

@Injectable({
    providedIn: 'root',
})
export class DictHttpService {
    // TODO create and return HTTP request to the server
    getListDict(): Dictionary[] {
        return [
            { title: 'French', description: 'Dictionnaire francais', words: ['wow'] },
            { title: 'English', description: 'Dictionnaire englais', words: ['wow'] },
        ];
    }

    uploadDict(dict: Dictionary): void {
        console.log(dict);
    }
}
