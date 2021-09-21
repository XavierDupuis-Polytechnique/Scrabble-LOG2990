import { Injectable } from '@angular/core';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { Bot } from '@app/GameLogic/player/bot';
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
        return this.dynamicWordList.has(word.toLowerCase());
    }

    wordGen(partWord: ValidWord): ValidWord[] {
        const dict = data as Dictionary;
        const wordList: ValidWord[] = [];
        const startOfString = 0;
        const notFound = -1;
        const tmpWordList: ValidWord[] = [];
        const reset = 0;
        const arrayBegin = 0;
        const maxLetterNumber = 7;
        let letterCountOfPartWord = 0;

        for (const letter of partWord.word) {
            if (letter !== '-') {
                letterCountOfPartWord++;
            }
        }

        if (partWord.word.includes('-')) {
            const word = partWord.word;
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

            const firstWord = tmpWordList[arrayBegin].word;
            for (const dictWord of dict.words) {
                if (dictWord.includes(firstWord)) {
                    foundIndex = dictWord.indexOf(firstWord);
                    if (foundIndex <= partWord.leftCount) {
                        const newWord: ValidWord = new ValidWord(dictWord, foundIndex);
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
            for (let tmpIndex = 1; tmpIndex <= lastIndex; index++) {
                const tmpWord = tmpWordList[tmpIndex];
                for (const tmpDictWord of tmpDict) {
                    oldFoundIndex = tmpDictWord.indexFound + oldSubWordLength;
                    if (tmpDictWord.word.includes(tmpWord.word, oldFoundIndex)) {
                        foundIndex = tmpDictWord.word.indexOf(tmpWord.word, oldFoundIndex);

                        if (foundIndex - oldFoundIndex === tmpWord.emptyCount && tmpDictWord.word.length - letterCountOfPartWord <= maxLetterNumber) {
                            if (tmpIndex === lastIndex) {
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
            for (const dictWord of tmpDict) {
                wordList.push(
                    new ValidWord(dictWord.word, reset, reset, reset, reset, partWord.isVertical, dictWord.startingTileX, dictWord.startingTileY),
                );
            }
        } else {
            let index = 0;
            for (const word of dict.words) {
                if (word.includes(partWord.word) && word.length - letterCountOfPartWord <= maxLetterNumber) {
                    index = word.indexOf(partWord.word);
                    if (
                        index <= partWord.leftCount &&
                        word.length - (index + partWord.word.length) <= partWord.rightCount &&
                        word !== partWord.word
                    ) {
                        const newWord: ValidWord = new ValidWord(word);
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

        return wordList;
    }

    // Check if it's possible to form the word with the currently available letters
    regexCheck(dictWord: ValidWord, placedLetters: string, bot: Bot): boolean {
        const letterRack = bot.letterRack;
        const mapRack = new Map();
        const notFound = -1;
        const firstLetterIndex = 1;
        const wordLength = dictWord.word.length;
        let placedWord = '';
        for (const letter of placedLetters) {
            if (letter === '-') {
                placedWord += '.';
            } else {
                placedWord += letter;
            }
        }

        for (const letter of letterRack) {
            const letterCount = mapRack.get(letter);
            if (mapRack.has(letter)) {
                mapRack.set(letter, letterCount + 1);
            } else {
                mapRack.set(letter, 1);
            }
        }
        let regex = new RegExp(placedWord.toLowerCase());
        let INDEX = dictWord.word.search(regex);
        if (INDEX === notFound) {
            return false;
        }
        while (INDEX !== firstLetterIndex) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            regex = new RegExp('(?<=[' + lettersLeft + '])' + placedWord.toLowerCase());
            INDEX = dictWord.word.search(regex);

            if (INDEX === notFound) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    INDEX = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = dictWord.word[INDEX - 1].toUpperCase() + placedWord;
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[INDEX - 1], mapRack);
                placedWord = dictWord.word[INDEX - 1] + placedWord;
            }
        }

        let indexOfDot: number = placedWord.indexOf('.');
        while (indexOfDot !== notFound) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            regex = new RegExp(placedWord.substring(0, indexOfDot).toLowerCase() + '(?=[' + lettersLeft + '])');
            INDEX = dictWord.word.search(regex);
            if (INDEX === notFound) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    INDEX = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord =
                        placedWord.substring(0, indexOfDot) + dictWord.word[placedWord.length].toUpperCase() + placedWord.substring(indexOfDot + 1);
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[placedWord.length], mapRack);
                placedWord =
                    placedWord.substring(0, indexOfDot) +
                    dictWord.word[placedWord.substring(0, indexOfDot).length] +
                    placedWord.substring(indexOfDot + 1);
            }
            indexOfDot = placedWord.indexOf('.');
        }

        while (placedWord.length !== wordLength) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            regex = new RegExp(placedWord.toLowerCase() + '(?=[' + lettersLeft + '])');
            INDEX = dictWord.word.search(regex);
            if (INDEX === notFound) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    INDEX = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = placedWord + dictWord.word[placedWord.length].toUpperCase();
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[placedWord.length], mapRack);
                placedWord = placedWord + dictWord.word[placedWord.length];
            }
        }
        if (dictWord.word === placedWord.toLowerCase()) {
            return true;
        } else {
            return false;
        }
    }

    tileToString(word: Tile[]): string {
        const wordTemp = '';
        word.forEach((letter) => {
            wordTemp.concat(letter.letterObject.char);
        });
        return wordTemp;
    }

    private deleteTmpLetter(placedLetter: string, mapRack: Map<string, number>) {
        if (!mapRack) return;
        const letterCount = mapRack.get(placedLetter);
        if (!letterCount) return;
        if (letterCount > 1) {
            mapRack.set(placedLetter, letterCount - 1);
        } else {
            mapRack.delete(placedLetter);
        }
    }

    private tmpLetterLeft(mapRack: Map<Letter, number>): string {
        let lettersLeft = '';
        if (!mapRack) return lettersLeft;
        for (const key of mapRack.keys()) {
            if (key.char !== '*') {
                const letterCount = mapRack.get(key);
                if (!letterCount) return lettersLeft;
                for (let i = 0; i < letterCount; i++) {
                    lettersLeft += key.char;
                }
            }
        }
        return lettersLeft;
    }

    // TODO to be removed
    // for(const word of wordList) {

    //     if(partWord.isVertical) {
    //         word.startingTileX = partWord.startingTileX
    //         word.startingTileY = partWord.startingTileY - ;
    //     } else {
    //         word.startingTileX = partWord.startingTileX - foundIndex;
    //         word.startingTileY = partWord.startingTileY;
    //     }word
    // }

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
