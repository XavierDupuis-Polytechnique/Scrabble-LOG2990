import { Injectable } from '@angular/core';
import { Tile } from '@app/GameLogic/game/tile';
import { DictionaryService } from '../dictionary.service';

@Injectable({
    providedIn: 'root',
})
export class WordValidatorService {
    wordTemp: String;
    constructor(dictionnary: DictionaryService) {}

    isAWord() {}

    tileToString(word: Tile[]): String {
        word.forEach((letter) => {
            this.wordTemp.concat(letter.letterObject.char.toString());
        });
        return this.wordTemp;
    }
}
