import { LiveDict } from '@app/dictionary-manager/default-dictionary';
import { DictionaryServerService } from '@app/dictionary-manager/dictionary-server.service';
import { MAX_WORD_LENGTH } from '@app/game/game-logic/constants';
import { Dictionary } from '@app/game/game-logic/validator/dictionary/dictionary';
import { Service } from 'typedi';

@Service()
export class DictionaryService {
    liveDictMap: Map<string, LiveDict> = new Map();
    liveGamesMap: Map<string, string> = new Map();
    dynamicWordList: Set<string>[] = [];
    constructor(private dictionaryServer: DictionaryServerService) {}

    makeGameDictionary(gameToken: string, dictTitle: string) {
        const uniqueName = this.dictionaryServer.getUniqueName(dictTitle);
        const liveDict = this.liveDictMap.get(uniqueName);
        if (!liveDict) {
            const dict = this.dictionaryServer.getDictByTitle(dictTitle);
            const words = this.getWords(dict as Dictionary);
            const newLiveDict: LiveDict = {
                currentUsage: 1,
                dynamicWordList: words,
            };
            this.liveDictMap.set(uniqueName, newLiveDict);
        } else {
            liveDict.currentUsage++;
            this.liveDictMap.set(uniqueName, liveDict);
        }
        this.liveGamesMap.set(gameToken, uniqueName);
    }

    deleteGameDictionary(gameToken: string) {
        const uniqueName = this.liveGamesMap.get(gameToken);
        if (!uniqueName) {
            return;
        }
        const liveDict = this.liveDictMap.get(uniqueName) as LiveDict;
        liveDict.currentUsage--;
        if (liveDict.currentUsage === 0) {
            this.liveDictMap.delete(uniqueName);
        } else {
            this.liveDictMap.set(uniqueName, liveDict);
        }
        this.liveGamesMap.delete(gameToken);
    }

    isWordInDict(word: string, gameToken: string): boolean {
        const uniqueName = this.liveGamesMap.get(gameToken);
        if (!uniqueName) {
            return false;
        }
        const liveDict = this.liveDictMap.get(uniqueName) as LiveDict;

        const wordLength = word.length;
        if (wordLength > MAX_WORD_LENGTH) {
            return false;
        }
        const words = liveDict.dynamicWordList[wordLength];
        return words.has(word.toLowerCase());
    }

    private getWords(dictionary: Dictionary): Set<string>[] {
        const words: Set<string>[] = [];
        for (let i = 0; i <= MAX_WORD_LENGTH; i++) {
            words.push(new Set());
        }
        dictionary.words.forEach((word) => {
            let wordLength = word.length;
            for (wordLength; wordLength <= MAX_WORD_LENGTH; wordLength++) {
                words[wordLength].add(word);
            }
        });
        return words;
    }
}
