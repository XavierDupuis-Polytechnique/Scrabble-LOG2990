import { ValidWord } from '@app/game-logic/player/bot/valid-word';

export interface DictInitialSearchSettings {
    partWord: ValidWord;
    dictWords: Set<string>;
    tmpWordList: ValidWord[];
    letterCountOfPartWord: number;
    tmpDict: ValidWord[];
    foundIndex: number;
}

export interface DictSubSearchSettings {
    tmpWordList: ValidWord[];
    tmpDict2: ValidWord[];
    oldSubWordLength: number;
    wordList: ValidWord[];
}

export interface DictWholeSearchSettings {
    partWord: ValidWord;
    dictWords: Set<string>;
    letterCountOfPartWord: number;
    wordList: ValidWord[];
}

export interface DictRegexSettings {
    dictWord: ValidWord;
    placedWord: string;
    mapRack: Map<string, number>;
}
