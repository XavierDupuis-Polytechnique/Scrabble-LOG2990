import { Injectable } from '@angular/core';
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

    wordGen(partWord: ValidWord): ValidWord[] {
        const dict = data as Dictionary;
        let wordList: ValidWord[] = [];
        const startOfString = 0;
        const notFound = -1;
        let tmpWordList: ValidWord[] = [];
        const reset = 0;
        const arrayBegin = 0;
        const maxLetterNumber = 7;
        let letterCountOfPartWord: number = 0;

        for (const letter of partWord.word) {
            if (letter !== '-') {
                letterCountOfPartWord++;
            }
        }

        if (partWord.word.includes('-')) {
            let word = partWord.word;
            let index = word.indexOf('-');
            let subWord = '';
            let leftIndex = startOfString;
            let emptyCount: number = reset;

            while (index !== notFound) {
                subWord = word.substring(leftIndex, index);
                tmpWordList.push(new ValidWord(subWord, reset, emptyCount));
                emptyCount = reset;
                while (word.charAt(index) === '-') {
                    index++;
                    emptyCount++;
                }
                leftIndex = index;
                index = word.indexOf('-', leftIndex);
            }

            subWord = word.substring(leftIndex);
            tmpWordList.push(new ValidWord(subWord, reset, emptyCount, reset, partWord.rightCount));

            let tmpDict: ValidWord[] = [];
            let tmpDict2: ValidWord[] = [];
            let foundIndex: number = startOfString;
            let oldFoundIndex: number;
            let oldSubWordLength: number = reset;

            let firstWord = tmpWordList[arrayBegin].word;
            for (const word of dict.words) {
                if (word.includes(firstWord)) {
                    foundIndex = word.indexOf(firstWord);
                    if (foundIndex <= partWord.leftCount) {
                        let newWord: ValidWord = new ValidWord(word, foundIndex);
                        if (partWord.isVertical) {
                            newWord.startingTileX = partWord.startingTileX;
                            newWord.startingTileY = partWord.startingTileY - foundIndex;
                        } else {
                            newWord.startingTileX = partWord.startingTileX - foundIndex;
                            newWord.startingTileY = partWord.startingTileY;
                        }
                        tmpDict.push(newWord);
                    }
                }
            }
            oldSubWordLength = firstWord.length;

            const lastIndex = tmpWordList.length - 1;
            for (let index = 1; index <= lastIndex; index++) {
                let tmpWord = tmpWordList[index];
                for (const tmpDictWord of tmpDict) {
                    oldFoundIndex = tmpDictWord.indexFound + oldSubWordLength;
                    if (tmpDictWord.word.includes(tmpWord.word, oldFoundIndex)) {
                        foundIndex = tmpDictWord.word.indexOf(tmpWord.word, oldFoundIndex);

                        if (foundIndex - oldFoundIndex === tmpWord.emptyCount && tmpDictWord.word.length - letterCountOfPartWord <= maxLetterNumber) {
                            if (index === lastIndex) {
                                if (tmpDictWord.word.length - (foundIndex + tmpWord.word.length) <= tmpWord.rightCount) {
                                    tmpDictWord.indexFound = foundIndex;
                                    tmpDict2.push(tmpDictWord);
                                }
                            } else {
                                tmpDictWord.indexFound = foundIndex;
                                tmpDict2.push(tmpDictWord);
                            }
                        }
                    }
                }
                tmpDict = tmpDict2;
                tmpDict2 = [];

                oldSubWordLength = tmpWord.word.length;
            }
            for (const word of tmpDict) {
                wordList.push(new ValidWord(word.word, reset, reset, reset, reset, partWord.isVertical, word.startingTileX, word.startingTileY));
            }
        } else {
            let index: number = 0;
            for (const word of dict.words) {
                if (word.includes(partWord.word) && word.length - letterCountOfPartWord <= maxLetterNumber) {
                    index = word.indexOf(partWord.word);
                    if (
                        index <= partWord.leftCount &&
                        word.length - (index + partWord.word.length) <= partWord.rightCount &&
                        word !== partWord.word
                    ) {
                        let newWord: ValidWord = new ValidWord(word);
                        newWord.isVertical = partWord.isVertical;
                        if (partWord.isVertical) {
                            newWord.startingTileX = partWord.startingTileX;
                            newWord.startingTileY = partWord.startingTileY - index;
                        } else {
                            newWord.startingTileX = partWord.startingTileX - index;
                            newWord.startingTileY = partWord.startingTileY;
                        }
                        wordList.push(newWord);
                    }
                }
            }
        }

        // for(const word of wordList) {

        //     if(partWord.isVertical) {
        //         word.startingTileX = partWord.startingTileX
        //         word.startingTileY = partWord.startingTileY - ;
        //     } else {
        //         word.startingTileX = partWord.startingTileX - foundIndex;
        //         word.startingTileY = partWord.startingTileY;
        //     }word
        // }
        return wordList;
    }
}
