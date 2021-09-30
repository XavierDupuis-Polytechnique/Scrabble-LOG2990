import { Injectable } from '@angular/core';
import { ARRAY_BEGIN, FIRST_LETTER_INDEX, MAX_WORD_LENGTH, NOT_FOUND, RACK_LETTER_COUNT, RESET, START_OF_STRING } from '@app/GameLogic/constants';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { Dictionary } from '@app/GameLogic/validator/dictionary';
import data from 'src/assets/dictionary.json';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    dynamicWordList: Set<string>[] = [];
    constructor() {
        const dict = data as Dictionary;
        for (let i = 0; i <= MAX_WORD_LENGTH; i++) {
            this.dynamicWordList.push(new Set());
        }
        this.addWords(dict);
    }

    addWords(dictionary: Dictionary) {
        dictionary.words.forEach((word) => {
            let wordLength = word.length;
            for (wordLength; wordLength <= MAX_WORD_LENGTH; wordLength++) {
                this.dynamicWordList[wordLength].add(word);
            }
        });
    }

    isWordInDict(word: string): boolean {
        return this.dynamicWordList[word.length].has(word.toLowerCase());
    }

    wordGen(partWord: ValidWord): ValidWord[] {
        const wordList: ValidWord[] = [];
        const tmpWordList: ValidWord[] = [];

        let letterCountOfPartWord = 0;
        letterCountOfPartWord = this.countNumberOfLetters(partWord, letterCountOfPartWord);

        let maxDictWordLength = 0;
        const missingLetters = partWord.word.length - letterCountOfPartWord + partWord.leftCount + partWord.rightCount;
        if (missingLetters === 0) return wordList;
        if (missingLetters > RACK_LETTER_COUNT) {
            maxDictWordLength = letterCountOfPartWord + RACK_LETTER_COUNT;
        } else {
            maxDictWordLength = letterCountOfPartWord + missingLetters;
        }
        if (maxDictWordLength > MAX_WORD_LENGTH) {
            maxDictWordLength = MAX_WORD_LENGTH;
        }
        const dict = this.dynamicWordList[maxDictWordLength];

        if (partWord.word.includes('-')) {
            this.getSubWordsOfPartWord(partWord, tmpWordList);

            const tmpDict: ValidWord[] = [];
            const tmpDict2: ValidWord[] = [];
            const foundIndex: number = START_OF_STRING;
            let oldSubWordLength: number = RESET;

            oldSubWordLength = this.initialDictionarySearch(partWord, dict, tmpWordList, letterCountOfPartWord, tmpDict, foundIndex);
            this.subDictionarySearch(partWord, tmpWordList, tmpDict, tmpDict2, oldSubWordLength, letterCountOfPartWord, wordList);
        } else {
            this.wholePartWordDictionarySearch(partWord, dict, letterCountOfPartWord, wordList);
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

        placedWord = this.checkLeftOfPlacedWord(dictWord, placedWord, mapRack);
        placedWord = this.checkMiddleOfPlacedWord(dictWord, placedWord, mapRack);
        placedWord = this.checkRightOfPlacedWord(dictWord, placedWord, mapRack, wordLength);

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
        dictWords: Set<string>,
        tmpWordList: ValidWord[],
        letterCountOfPartWord: number,
        tmpDict: ValidWord[],
        foundIndex: number,
    ): number {
        const firstWord = tmpWordList[ARRAY_BEGIN].word;
        for (const dictWord of dictWords) {
            foundIndex = dictWord.indexOf(firstWord);
            if (foundIndex !== NOT_FOUND && dictWord.length - letterCountOfPartWord <= RACK_LETTER_COUNT) {
                if (foundIndex <= partWord.leftCount) {
                    const newWord: ValidWord = new ValidWord(dictWord, foundIndex);
                    this.setStartingTile(partWord, newWord, foundIndex);
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
                const foundIndex = tmpDictWord.word.indexOf(tmpWord.word, oldFoundIndex);
                if (foundIndex !== NOT_FOUND) {
                    if (foundIndex - oldFoundIndex === tmpWord.emptyCount && tmpDictWord.word.length - letterCountOfPartWord <= RACK_LETTER_COUNT) {
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

    private wholePartWordDictionarySearch(partWord: ValidWord, dictWords: Set<string>, letterCountOfPartWord: number, wordList: ValidWord[]) {
        let foundIndex = 0;
        for (const dictWord of dictWords) {
            foundIndex = dictWord.indexOf(partWord.word);
            if (foundIndex !== NOT_FOUND && dictWord.length - letterCountOfPartWord <= RACK_LETTER_COUNT) {
                if (
                    foundIndex <= partWord.leftCount &&
                    dictWord.length - (foundIndex + partWord.word.length) <= partWord.rightCount &&
                    dictWord !== partWord.word
                ) {
                    const newWord: ValidWord = new ValidWord(dictWord);
                    newWord.isVertical = partWord.isVertical;
                    this.setStartingTile(partWord, newWord, foundIndex);
                    wordList.push(newWord);
                }
            }
        }
    }

    private setStartingTile(partWord: ValidWord, newWord: ValidWord, foundIndex: number) {
        if (partWord.isVertical) {
            newWord.startingTileX = partWord.startingTileX;
            newWord.startingTileY = partWord.startingTileY - foundIndex;
        } else {
            newWord.startingTileX = partWord.startingTileX - foundIndex;
            newWord.startingTileY = partWord.startingTileY;
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

    private checkLeftOfPlacedWord(dictWord: ValidWord, placedWord: string, mapRack: Map<string, number>): string {
        let index: number;
        do {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            let regex = new RegExp('(?<=[' + lettersLeft + '])' + placedWord.toLowerCase());
            index = dictWord.word.search(regex);
            if (index === NOT_FOUND) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    index = dictWord.word.search(regex);
                    if (index === 0) break;
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = dictWord.word[index - 1].toUpperCase() + placedWord;
                } else break;
            } else {
                index--;
                this.deleteTmpLetter(dictWord.word[index], mapRack);
                placedWord = dictWord.word[index] + placedWord;
            }
        } while (index > FIRST_LETTER_INDEX);
        return placedWord;
    }

    private checkMiddleOfPlacedWord(dictWord: ValidWord, placedWord: string, mapRack: Map<string, number>): string {
        let indexOfDot: number = placedWord.indexOf('.');
        let index: number;
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

    private checkRightOfPlacedWord(dictWord: ValidWord, placedWord: string, mapRack: Map<string, number>, wordLength: number): string {
        let index: number;
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
        const letterCount = mapRack.get(placedLetter);
        if (letterCount && letterCount > 1) {
            mapRack.set(placedLetter, letterCount - 1);
        } else {
            mapRack.delete(placedLetter);
        }
    }

    private tmpLetterLeft(mapRack: Map<string, number>): string {
        let lettersLeft = '';
        for (const key of mapRack.keys()) {
            if (key !== '*') {
                lettersLeft += key.toLowerCase();
            }
        }
        return lettersLeft;
    }
}
