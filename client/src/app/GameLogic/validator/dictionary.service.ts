import { Injectable } from '@angular/core';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { Dictionary } from '@app/GameLogic/validator/dictionary';
import data from 'src/assets/dictionary.json';
import { Tile } from '../game/tile';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    dynamicWordList: Set<string> = new Set();
    // loadedDictionaries: Dictionary[] = [];

    constructor() {
        // console.log(data);
        const dict = data as Dictionary;
        this.addWords(dict);
        // this.loadedDictionaries.push(dict);
    }

    addWords(dictionary: Dictionary) {
        dictionary.words.forEach((word) => {
            this.dynamicWordList.add(word);
        });
    }

    isWordInDict(word: string): boolean {
        return this.dynamicWordList.has(word.toLowerCase());
    }

    wordGen(partWord: string): ValidWord[] {
        const dict = data as Dictionary;
        const wordList: ValidWord[] = [];
        dict.words.forEach((word) => {
            if (word.includes(partWord)) {
                wordList.push(new ValidWord(word));
            }
        });
        return wordList;
    }
    //
    tileToString(word: Tile[]): string {
        let wordTemp: string = '';
        word.forEach((letter) => {
            wordTemp.concat(letter.letterObject.char);
        });
        return wordTemp;
    }

    // TODO to be removed

    // let dictService = new DictionaryService();
    // console.log(dictService.isWordInDict('test'));
    // console.log('test1');
    // let test1 = dictService.wordGen('test');
    // let test2 = dictService.wordGen('allo');
    // console.log(33333333333333333333);
    // let test3 = dictService.wordGen('il');
    // console.log(444444444444444444444);
    // let test4 = dictService.wordGen('a');
    // console.log(test1);
    // test1.forEach((element) => {
    //     console.log(element.word);
    // });
    // console.log(test1);
    // console.log(test2);
    // console.log(test3);
    // console.log(test4);
    // console.log('test1 end');
}
