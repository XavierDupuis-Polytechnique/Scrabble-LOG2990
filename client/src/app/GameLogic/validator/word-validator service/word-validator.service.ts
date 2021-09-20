import { Injectable } from '@angular/core';
import { Tile } from '@app/GameLogic/game/tile';
import { DictionaryService } from '../dictionary.service';

@Injectable({
    providedIn: 'root',
})
export class WordValidatorService {
    constructor(private dictionary: DictionaryService) {}

    isAWord(word: Tile[]): boolean {
        return this.dictionary.isWordInDict(this.tileToString(word).toLowerCase());
    }

    tileToString(word: Tile[]): string {
        let wordTemp: string = '';
        word.forEach((tile) => {
            wordTemp = wordTemp.concat(tile.letterObject.char.valueOf());
        });
        return wordTemp;
    }
    // isAWord(word: Word): boolean {
    //     return this.dictionary.isWordInDict(this.tileToString(word));
    // }

    // tileToString(word: Word): string {
    //     let wordTemp: string = '';
    //     word.letters.forEach((letter) => {
    //         wordTemp.concat(letter.letterObject.char);
    //     });
    //     return wordTemp;
    // }
}
