import { Injectable } from '@angular/core';
import { PossibleWord } from '@app/GameLogic/player/possible-word';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { Dictionary } from '@app/GameLogic/validator/dictionary';
import data from 'src/assets/dictionary.json';

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
        return this.dynamicWordList.has(word);
    }

    wordGen(partWord: string): ValidWord[] {
        const dict = data as Dictionary;
        let wordList: ValidWord[] = [];
        const startOfString = 0;
        const notFound = -1;
        let tmpWordList: PossibleWord[] = [];
        const reset = 0;
        const arrayBegin = 0;

        if (partWord.includes('-')) {
            let word = partWord;
            let index = word.indexOf('-');
            let subWord = '';
            let leftIndex = startOfString;
            let emptyCount: number = reset;

            while (index !== notFound) {
                subWord = word.substring(leftIndex, index);
                tmpWordList.push(new PossibleWord(subWord, reset, emptyCount));
                emptyCount = reset;
                while (word.charAt(index) === '-') {
                    index++;
                    emptyCount++;
                }
                leftIndex = index;
                index = word.indexOf('-', leftIndex);
            }

            subWord = word.substring(leftIndex);
            tmpWordList.push(new PossibleWord(subWord, reset, emptyCount));

            let tmpDict: PossibleWord[] = [];
            let tmpDict2: PossibleWord[] = [];
            let foundIndex: number = startOfString;
            let oldFoundIndex: number;

            for (let word of dict.words) {
                let firstWord = tmpWordList[arrayBegin].word;
                if (word.includes(firstWord)) {
                    foundIndex = word.indexOf(firstWord);
                    tmpDict.push(new PossibleWord(word, foundIndex));
                }
            }

            let firstPass: boolean = true;
            let oldSubWordLength: number = reset;
            for (let tmpWord of tmpWordList) {
                if (firstPass) {
                    firstPass = false;
                } else {
                    for (let tmpDictWord of tmpDict) {
                        oldFoundIndex = tmpDictWord.indexFound + oldSubWordLength;
                        if (tmpDictWord.word.includes(tmpWord.word, oldFoundIndex)) {
                            foundIndex = tmpDictWord.word.indexOf(tmpWord.word, oldFoundIndex);

                            if (foundIndex - oldFoundIndex === tmpWord.emptyCount) {
                                tmpDict2.push(new PossibleWord(tmpDictWord.word, foundIndex));
                            }
                        }
                    }
                    tmpDict = tmpDict2;
                    tmpDict2 = [];
                }
                oldSubWordLength = tmpWord.word.length;
            }

            for (let word of tmpDict) {
                wordList.push(new ValidWord(word.word));
            }
        } else {
            for (let word of dict.words) {
                if (partWord.length === 1) {
                    let maxLetterNumber = 7;
                    if (word.length <= maxLetterNumber && word.includes(partWord)) {
                        wordList.push(new ValidWord(word));
                    }
                } else if (word.includes(partWord)) {
                    wordList.push(new ValidWord(word));
                }
            }
        }

        return wordList;
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
