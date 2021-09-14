import { Injectable } from '@angular/core';
import { Dictionary } from '@app/GameLogic/validator/dictionary';
import data from 'src/assets/dictionary.json';
import { ValidWord } from '../player/valid-word';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    dynamicWordList: Set<string> = new Set();
    //loadedDictionaries: Dictionary[] = [];

    constructor() {
        console.log(data);
        let dict = <Dictionary>data;
        this.addWords(dict);
        //this.loadedDictionaries.push(dict);
    }

    addWords(dictionary: Dictionary) {
        dictionary.words.forEach((word) => {
            this.dynamicWordList.add(word);
        });
    }

    isWordValid(word: string): boolean {
        return this.dynamicWordList.has(word);
    }

    wordGen(partWord: string): ValidWord[] {
        let dict = <Dictionary>data;
        let wordList: ValidWord[] = [];
        dict.words.forEach((word) => {
            if (word.includes(partWord)) {
                wordList.push(new ValidWord(word));
            }
        });
        return wordList;
    }

    //TODO to be removed

    // let dictService = new DictionaryService();
    // console.log(dictService.isWordValid('test'));
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
