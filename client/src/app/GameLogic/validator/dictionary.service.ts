import { Injectable } from '@angular/core';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
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
            for (let tmpIndex = 1; tmpIndex <= lastIndex; tmpIndex++) {
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
            if (partWord.leftCount !== 0 || partWord.rightCount !== 0) {
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
        }

        return wordList;
    }

    regexCheck(dictWord: ValidWord, placedLetters: string, botLetterRack: Letter[]): string {
        const letterRack = botLetterRack;
        const mapRack = new Map<string, number>();
        const notFound = -1;
        const firstLetterIndex = 1;
        const wordLength = dictWord.word.length;
        let placedWord = '';
        let tmpPlacedWord;
        for (const letter of placedLetters) {
            if (letter === '-') {
                placedWord += '.';
            } else {
                placedWord += letter;
            }
        }

        for (const letter of letterRack) {
            const letterCount = mapRack.get(letter.char.toLowerCase());
            if (letterCount !== undefined) {
                mapRack.set(letter.char.toLowerCase(), letterCount + 1);
            } else {
                mapRack.set(letter.char.toLowerCase(), 1);
            }
        }
        tmpPlacedWord = placedWord;
        let regex = new RegExp(tmpPlacedWord.toLowerCase());
        let index = dictWord.word.search(regex);
        if (index === notFound) {
            return 'false';
        }

        while (index > firstLetterIndex) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            tmpPlacedWord = placedWord;
            regex = new RegExp('(?<=[' + lettersLeft + '])' + tmpPlacedWord.toLowerCase());
            index = dictWord.word.search(regex);

            if (index === notFound) {
                if (mapRack.has('*')) {
                    tmpPlacedWord = placedWord;
                    regex = new RegExp(tmpPlacedWord.toLowerCase());
                    index = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = dictWord.word[index - 1].toUpperCase() + placedWord;
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[index - 1], mapRack);
                placedWord = dictWord.word[index - 1] + placedWord;
            }
        }

        let indexOfDot: number = placedWord.indexOf('.');
        while (indexOfDot !== notFound) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            const leftOfDot = placedWord.substring(0, indexOfDot).toLowerCase();
            regex = new RegExp(leftOfDot + '(?=[' + lettersLeft + '])');
            index = dictWord.word.search(regex);
            if (index > 0) return 'false';
            const rightOfDot = placedWord.substring(indexOfDot + 1);
            if (index === notFound) {
                if (mapRack.has('*')) {
                    tmpPlacedWord = placedWord;
                    regex = new RegExp(tmpPlacedWord.toLowerCase());
                    index = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = leftOfDot + dictWord.word[leftOfDot.length].toUpperCase() + rightOfDot;
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[indexOfDot], mapRack);
                placedWord = leftOfDot + dictWord.word[leftOfDot.length] + rightOfDot;
            }
            indexOfDot = placedWord.indexOf('.');
        }


        while (placedWord.length !== wordLength) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            tmpPlacedWord = placedWord;
            regex = new RegExp(tmpPlacedWord.toLowerCase() + '(?=[' + lettersLeft + '])');
            index = dictWord.word.search(regex);
            if (index > 0) return 'false';
            if (index === notFound) {
                if (mapRack.has('*')) {
                    tmpPlacedWord = placedWord;
                    regex = new RegExp(tmpPlacedWord.toLowerCase());
                    index = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = placedWord + dictWord.word[placedWord.length].toUpperCase();
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[placedWord.length], mapRack);
                placedWord = placedWord + dictWord.word[placedWord.length];
            }
        }

        tmpPlacedWord = placedWord;
        if (dictWord.word === tmpPlacedWord.toLowerCase()) {
            return placedWord;
        } else {
            return 'false';
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

    private tmpLetterLeft(mapRack: Map<string, number>): string {
        let lettersLeft = '';
        if (!mapRack) return lettersLeft;
        for (const key of mapRack.keys()) {
            if (key !== '*') {
                lettersLeft += key.toLowerCase();
            }
        }
        return lettersLeft;
    }
}
