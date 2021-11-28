import { Injectable } from '@angular/core';
import { ARRAY_BEGIN, FIRST_LETTER_INDEX, MAX_WORD_LENGTH, NOT_FOUND, RACK_LETTER_COUNT, RESET, START_OF_STRING } from '@app/game-logic/constants';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { ValidWord } from '@app/game-logic/player/bot/valid-word';
import {
    DictInitialSearchSettings,
    DictRegexSettings,
    DictSubSearchSettings,
    DictWholeSearchSettings,
} from '@app/game-logic/validator/dict-settings';
import { Dictionary } from '@app/game-logic/validator/dictionary';
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
        const dictWords = this.dynamicWordList[maxDictWordLength];

        if (partWord.word.includes('-')) {
            this.getSubWordsOfPartWord(partWord, tmpWordList);

            const tmpDict: ValidWord[] = [];
            const tmpDict2: ValidWord[] = [];
            const foundIndex: number = START_OF_STRING;
            let oldSubWordLength: number = RESET;
            const initialSettings: DictInitialSearchSettings = { partWord, dictWords, tmpWordList, letterCountOfPartWord, tmpDict, foundIndex };
            oldSubWordLength = this.initialDictionarySearch(initialSettings);
            const subSettings: DictSubSearchSettings = { tmpWordList, tmpDict2, oldSubWordLength, wordList };
            this.subDictionarySearch(initialSettings, subSettings);
        } else {
            const wholeSettings: DictWholeSearchSettings = { partWord, dictWords, letterCountOfPartWord, wordList };
            this.wholePartWordDictionarySearch(wholeSettings);
        }
        return wordList;
    }

    regexValidation(dictWord: ValidWord, placedLetters: string, botLetterRack: Letter[]): string {
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
        const regexSettings: DictRegexSettings = { dictWord, placedWord, mapRack };
        placedWord = this.validateLeftOfPlacedWord(regexSettings);
        placedWord = this.validateMiddleOfPlacedWord(regexSettings);
        placedWord = this.validateRightOfPlacedWord(regexSettings, wordLength);

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

    private initialDictionarySearch(settings: DictInitialSearchSettings): number {
        const firstWord = settings.tmpWordList[ARRAY_BEGIN].word;
        for (const dictWord of settings.dictWords) {
            settings.foundIndex = dictWord.indexOf(firstWord);
            if (settings.foundIndex !== NOT_FOUND && dictWord.length - settings.letterCountOfPartWord <= RACK_LETTER_COUNT) {
                if (settings.foundIndex <= settings.partWord.leftCount) {
                    const newWord: ValidWord = new ValidWord(dictWord, settings.foundIndex);
                    this.setStartingTile(settings.partWord, newWord, settings.foundIndex);
                    settings.tmpDict.push(newWord);
                }
            }
        }
        const oldSubWordLength = firstWord.length;
        return oldSubWordLength;
    }

    private subDictionarySearch(initialSettings: DictInitialSearchSettings, subSettings: DictSubSearchSettings) {
        const lastIndex = subSettings.tmpWordList.length - 1;
        for (let tmpIndex = 1; tmpIndex <= lastIndex; tmpIndex++) {
            const tmpWord = subSettings.tmpWordList[tmpIndex];
            for (const tmpDictWord of initialSettings.tmpDict) {
                const oldFoundIndex: number = tmpDictWord.indexFound + subSettings.oldSubWordLength;
                const foundIndex = tmpDictWord.word.indexOf(tmpWord.word, oldFoundIndex);
                if (foundIndex === NOT_FOUND) {
                    continue;
                }
                if (
                    foundIndex - oldFoundIndex !== tmpWord.emptyCount ||
                    tmpDictWord.word.length - initialSettings.letterCountOfPartWord > RACK_LETTER_COUNT
                ) {
                    continue;
                }
                if (tmpIndex === lastIndex) {
                    if (tmpDictWord.word.length - (foundIndex + tmpWord.word.length) > tmpWord.rightCount) {
                        continue;
                    }
                    tmpDictWord.indexFound = foundIndex;
                    subSettings.tmpDict2.push(tmpDictWord);
                } else {
                    tmpDictWord.indexFound = foundIndex;
                    subSettings.tmpDict2.push(tmpDictWord);
                }
            }
            initialSettings.tmpDict = subSettings.tmpDict2;
            subSettings.tmpDict2 = [];

            subSettings.oldSubWordLength = tmpWord.word.length;
        }
        for (const dictWord of initialSettings.tmpDict) {
            const newWord: ValidWord = new ValidWord(dictWord.word);
            newWord.isVertical = initialSettings.partWord.isVertical;
            newWord.startingTileX = dictWord.startingTileX;
            newWord.startingTileY = dictWord.startingTileY;
            newWord.numberOfLettersPlaced = dictWord.word.length - initialSettings.letterCountOfPartWord;
            subSettings.wordList.push(newWord);
        }
    }

    private wholePartWordDictionarySearch(wholeSettings: DictWholeSearchSettings) {
        let foundIndex = 0;
        for (const dictWord of wholeSettings.dictWords) {
            foundIndex = dictWord.indexOf(wholeSettings.partWord.word);
            if (foundIndex !== NOT_FOUND && dictWord.length - wholeSettings.letterCountOfPartWord <= RACK_LETTER_COUNT) {
                if (
                    foundIndex <= wholeSettings.partWord.leftCount &&
                    dictWord.length - (foundIndex + wholeSettings.partWord.word.length) <= wholeSettings.partWord.rightCount &&
                    dictWord !== wholeSettings.partWord.word
                ) {
                    const newWord: ValidWord = new ValidWord(dictWord);
                    newWord.isVertical = wholeSettings.partWord.isVertical;
                    this.setStartingTile(wholeSettings.partWord, newWord, foundIndex);
                    newWord.numberOfLettersPlaced = dictWord.length - wholeSettings.letterCountOfPartWord;
                    wholeSettings.wordList.push(newWord);
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

    private validateLeftOfPlacedWord(regexSettings: DictRegexSettings): string {
        let index: number;
        do {
            const lettersLeft = this.tmpLetterLeft(regexSettings.mapRack);
            let regex = new RegExp('(?<=[' + lettersLeft + '])' + regexSettings.placedWord.toLowerCase());
            index = regexSettings.dictWord.word.search(regex);
            if (index === NOT_FOUND) {
                if (regexSettings.mapRack.has('*')) {
                    regex = new RegExp(regexSettings.placedWord.toLowerCase());
                    index = regexSettings.dictWord.word.search(regex);
                    if (index === 0) break;
                    this.deleteTmpLetter('*', regexSettings.mapRack);
                    regexSettings.placedWord = regexSettings.dictWord.word[index - 1].toUpperCase() + regexSettings.placedWord;
                } else break;
            } else {
                index--;
                this.deleteTmpLetter(regexSettings.dictWord.word[index], regexSettings.mapRack);
                regexSettings.placedWord = regexSettings.dictWord.word[index] + regexSettings.placedWord;
            }
        } while (index > FIRST_LETTER_INDEX);
        return regexSettings.placedWord;
    }

    private validateMiddleOfPlacedWord(regexSettings: DictRegexSettings): string {
        let indexOfDot: number = regexSettings.placedWord.indexOf('.');
        let index: number;
        while (indexOfDot !== NOT_FOUND) {
            const lettersLeft = this.tmpLetterLeft(regexSettings.mapRack);
            const leftOfDot = regexSettings.placedWord.substring(0, indexOfDot);
            let regex = new RegExp(leftOfDot.toLowerCase() + '(?=[' + lettersLeft + '])');
            index = regexSettings.dictWord.word.search(regex);
            const rightOfDot = regexSettings.placedWord.substring(indexOfDot + 1);
            if (index === NOT_FOUND || index > 0) {
                if (regexSettings.mapRack.has('*')) {
                    regex = new RegExp(regexSettings.placedWord.toLowerCase());
                    index = regexSettings.dictWord.word.search(regex);
                    this.deleteTmpLetter('*', regexSettings.mapRack);
                    regexSettings.placedWord = leftOfDot + regexSettings.dictWord.word[leftOfDot.length].toUpperCase() + rightOfDot;
                } else break;
            } else {
                this.deleteTmpLetter(regexSettings.dictWord.word[indexOfDot], regexSettings.mapRack);
                regexSettings.placedWord = leftOfDot + regexSettings.dictWord.word[leftOfDot.length] + rightOfDot;
            }
            indexOfDot = regexSettings.placedWord.indexOf('.');
        }
        return regexSettings.placedWord;
    }

    private validateRightOfPlacedWord(regexSettings: DictRegexSettings, wordLength: number): string {
        let index: number;
        while (regexSettings.placedWord.length !== wordLength) {
            const lettersLeft = this.tmpLetterLeft(regexSettings.mapRack);
            let regex = new RegExp(regexSettings.placedWord.toLowerCase() + '(?=[' + lettersLeft + '])');
            index = regexSettings.dictWord.word.search(regex);
            if (index === NOT_FOUND || index > 0) {
                if (regexSettings.mapRack.has('*')) {
                    regex = new RegExp(regexSettings.placedWord.toLowerCase());
                    index = regexSettings.dictWord.word.search(regex);
                    this.deleteTmpLetter('*', regexSettings.mapRack);
                    regexSettings.placedWord = regexSettings.placedWord + regexSettings.dictWord.word[regexSettings.placedWord.length].toUpperCase();
                } else break;
            } else {
                this.deleteTmpLetter(regexSettings.dictWord.word[regexSettings.placedWord.length], regexSettings.mapRack);
                regexSettings.placedWord = regexSettings.placedWord + regexSettings.dictWord.word[regexSettings.placedWord.length];
            }
        }
        return regexSettings.placedWord;
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
