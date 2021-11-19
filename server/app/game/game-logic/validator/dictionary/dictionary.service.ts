import { MAX_WORD_LENGTH } from '@app/game/game-logic/constants';
import { Dictionary } from '@app/game/game-logic/validator/dictionary/dictionary';
import * as data from 'assets/dictionary.json';
import { Service } from 'typedi';

@Service()
export class DictionaryService {
    dynamicWordList: Set<string>[] = [];
    constructor() {
        // TODO Add all dict here
        const dict = data as Dictionary;
        for (let i = 0; i <= MAX_WORD_LENGTH; i++) {
            this.dynamicWordList.push(new Set());
        }
        this.addWords(dict);
    }

    isWordInDict(word: string): boolean {
        // TODO Search in the right dict here
        return this.dynamicWordList[word.length].has(word.toLowerCase());
    }

    private addWords(dictionary: Dictionary) {
        dictionary.words.forEach((word) => {
            let wordLength = word.length;
            for (wordLength; wordLength <= MAX_WORD_LENGTH; wordLength++) {
                this.dynamicWordList[wordLength].add(word);
            }
        });
    }
}
