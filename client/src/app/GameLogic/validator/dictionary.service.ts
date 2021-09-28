import { Injectable } from '@angular/core';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { Dictionary } from '@app/GameLogic/validator/dictionary';
import data from 'src/assets/dictionary.json';

const START_OF_STRING = 0;
const NOT_FOUND = -1;
const RESET = 0;
const ARRAY_BEGIN = 0;
const MAX_LETTERS_COUNT = 7;
const FIRST_LETTER_INDEX = 1;

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    dynamicWordList: Set<string> = new Set();

    constructor() {
        const dict = data as Dictionary;
        this.addWords(dict);
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
        const tmpWordList: ValidWord[] = [];

        let letterCountOfPartWord = 0;
        letterCountOfPartWord = this.countNumberOfLetters(partWord, letterCountOfPartWord);

        if (partWord.word.includes('-')) {
            this.getSubWordsOfPartWord(partWord, tmpWordList);

            const tmpDict: ValidWord[] = [];
            const tmpDict2: ValidWord[] = [];
            const foundIndex: number = START_OF_STRING;
            let oldSubWordLength: number = RESET;

            oldSubWordLength = this.initialDictionarySearch(partWord, dict.words, tmpWordList, tmpDict, foundIndex);
            this.subDictionarySearch(partWord, tmpWordList, tmpDict, tmpDict2, oldSubWordLength, letterCountOfPartWord, wordList);
        } else {
            this.wholePartWordDictionarySearch(partWord, dict.words, letterCountOfPartWord, wordList);
        }
        return wordList;
    }

    regexCheck(dictWord: ValidWord, placedLetters: string, botLetterRack: Letter[]): string {
        const letterRack = botLetterRack;
        const mapRack = new Map<string, number>();
        const wordLength = dictWord.word.length;

        let placedWord = this.placedWordReformat(placedLetters);
        this.addLetterRackToMap(letterRack, mapRack);

        const regex = new RegExp(placedWord.toLowerCase());
        const index = dictWord.word.search(regex);
        if (index === NOT_FOUND) {
            return 'false';
        }

        placedWord = this.checkLeftOfPlacedWord(index, dictWord, placedWord, mapRack);
        placedWord = this.checkMiddleOfPlacedWord(index, dictWord, placedWord, mapRack);
        placedWord = this.checkRightOfPlacedWord(index, dictWord, placedWord, mapRack, wordLength);

        if (dictWord.word === placedWord.toLowerCase()) {
            return placedWord;
        } else {
            return 'false';
        }
    }

    private countNumberOfLetters(partWord: ValidWord, letterCountOfPartWord: number): number {
        for (const letter of partWord.word) {
            if (letter !== '-') {
                letterCountOfPartWord++;
            }
        }
        return letterCountOfPartWord;
    }

    private getSubWordsOfPartWord(partWord: ValidWord, tmpWordList: ValidWord[]): number {
        const word = partWord.word;
        let index = word.indexOf('-');
        let subWord = '';
        let leftIndex: number = START_OF_STRING;
        let emptyCount: number = RESET;
        while (index !== NOT_FOUND) {
            subWord = word.substring(leftIndex, index);
            tmpWordList.push(new ValidWord(subWord, RESET, emptyCount));
            emptyCount = RESET;
            while (word.charAt(index) === '-') {
                index++;
                emptyCount++;
            }
            leftIndex = index;
            index = word.indexOf('-', leftIndex);
        }
        subWord = word.substring(leftIndex);
        tmpWordList.push(new ValidWord(subWord, RESET, emptyCount, RESET, partWord.rightCount));
        return leftIndex;
    }

    private initialDictionarySearch(
        partWord: ValidWord,
        dictWords: string[],
        tmpWordList: ValidWord[],
        tmpDict: ValidWord[],
        foundIndex: number,
    ): number {
        const firstWord = tmpWordList[ARRAY_BEGIN].word;
        for (const dictWord of dictWords) {
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
        const oldSubWordLength = firstWord.length;
        return oldSubWordLength;
    }

    private subDictionarySearch(
        partWord: ValidWord,
        tmpWordList: ValidWord[],
        tmpDict: ValidWord[],
        tmpDict2: ValidWord[],
        oldSubWordLength: number,
        letterCountOfPartWord: number,
        wordList: ValidWord[],
    ) {
        const lastIndex = tmpWordList.length - 1;
        for (let tmpIndex = 1; tmpIndex <= lastIndex; tmpIndex++) {
            const tmpWord = tmpWordList[tmpIndex];
            for (const tmpDictWord of tmpDict) {
                const oldFoundIndex: number = tmpDictWord.indexFound + oldSubWordLength;
                if (tmpDictWord.word.includes(tmpWord.word, oldFoundIndex)) {
                    const foundIndex = tmpDictWord.word.indexOf(tmpWord.word, oldFoundIndex);

                    if (foundIndex - oldFoundIndex === tmpWord.emptyCount && tmpDictWord.word.length - letterCountOfPartWord <= MAX_LETTERS_COUNT) {
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
                new ValidWord(dictWord.word, RESET, RESET, RESET, RESET, partWord.isVertical, dictWord.startingTileX, dictWord.startingTileY),
            );
        }
    }

    private wholePartWordDictionarySearch(partWord: ValidWord, dictWords: string[], letterCountOfPartWord: number, wordList: ValidWord[]) {
        let index = 0;
        if (partWord.leftCount !== 0 || partWord.rightCount !== 0) {
            for (const word of dictWords) {
                if (word.includes(partWord.word) && word.length - letterCountOfPartWord <= MAX_LETTERS_COUNT) {
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

    private placedWordReformat(placedLetters: string) {
        let placedWord = '';
        for (const letter of placedLetters) {
            if (letter === '-') {
                placedWord += '.';
            } else {
                placedWord += letter;
            }
        }
        return placedWord;
    }

    private addLetterRackToMap(letterRack: Letter[], mapRack: Map<string, number>) {
        for (const letter of letterRack) {
            const letterCount = mapRack.get(letter.char.toLowerCase());
            if (letterCount !== undefined) {
                mapRack.set(letter.char.toLowerCase(), letterCount + 1);
            } else {
                mapRack.set(letter.char.toLowerCase(), 1);
            }
        }
    }

    private checkLeftOfPlacedWord(index: number, dictWord: ValidWord, placedWord: string, mapRack: Map<string, number>): string {
        while (index > FIRST_LETTER_INDEX) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            let regex = new RegExp('(?<=[' + lettersLeft + '])' + placedWord.toLowerCase());
            index = dictWord.word.search(regex);

            if (index === NOT_FOUND) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    index = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = dictWord.word[index - 1].toUpperCase() + placedWord;
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[index - 1], mapRack);
                placedWord = dictWord.word[index - 1] + placedWord;
            }
        }
        return placedWord;
    }

    private checkMiddleOfPlacedWord(index: number, dictWord: ValidWord, placedWord: string, mapRack: Map<string, number>): string {
        let indexOfDot: number = placedWord.indexOf('.');
        while (indexOfDot !== NOT_FOUND) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            const leftOfDot = placedWord.substring(0, indexOfDot).toLowerCase();
            let regex = new RegExp(leftOfDot + '(?=[' + lettersLeft + '])');
            index = dictWord.word.search(regex);
            const rightOfDot = placedWord.substring(indexOfDot + 1);
            if (index === NOT_FOUND || index > 0) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
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
        return placedWord;
    }

    private checkRightOfPlacedWord(index: number, dictWord: ValidWord, placedWord: string, mapRack: Map<string, number>, wordLength: number): string {
        while (placedWord.length !== wordLength) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            let regex = new RegExp(placedWord.toLowerCase() + '(?=[' + lettersLeft + '])');
            index = dictWord.word.search(regex);
            if (index === NOT_FOUND || index > 0) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    index = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = placedWord + dictWord.word[placedWord.length].toUpperCase();
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[placedWord.length], mapRack);
                placedWord = placedWord + dictWord.word[placedWord.length];
            }
        }
        return placedWord;
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
