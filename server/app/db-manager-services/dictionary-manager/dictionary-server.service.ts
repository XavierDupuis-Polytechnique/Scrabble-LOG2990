import { DEFAULT_DICTIONARY, DictionaryServer } from '@app/db-manager-services/dictionary-manager/default-dictionary';
import { NOT_FOUND } from '@app/game/game-logic/constants';
import customDictionary from 'assets/customDictionary.json';
import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class DictionaryServerService {
    allDictionary: DictionaryServer[] = [];

    constructor() {
        this.start();
    }

    start() {
        // TODO Check assets for dict and load all data

        if (!customDictionary || (customDictionary as DictionaryServer[]).length === 0) {
            const defaultDict = DEFAULT_DICTIONARY;
            defaultDict.canEdit = false;
            this.allDictionary.push(defaultDict);
            this.saveToFile();
        } else {
            this.allDictionary = customDictionary as DictionaryServer[];
        }
    }

    isDictExist(dictName: string): boolean {
        for (const dict of this.allDictionary) {
            if (dict.title === dictName) {
                return true;
            }
        }
        return false;
    }

    getDictsList(): DictionaryServer[] {
        const dictsList: DictionaryServer[] = [];

        for (const dict of this.allDictionary) {
            const tmpDict: DictionaryServer = { title: dict.title, description: dict.description, canEdit: dict.canEdit };
            dictsList.push(tmpDict);
        }
        return dictsList;
    }

    getDictByTitle(dictTitle: string): DictionaryServer | undefined {
        for (const dict of this.allDictionary) {
            if (dict.title === dictTitle) {
                return dict;
            }
        }
        return undefined;
    }

    addDict(dict: DictionaryServer) {
        this.formatDict(dict);
        this.allDictionary.push(dict);
        this.saveToFile();
    }

    updateDict(oldDict: DictionaryServer, newDict: DictionaryServer) {
        const index = this.allDictionary.findIndex((dict) => dict.title === oldDict.title);
        const tmp = this.allDictionary[index];
        tmp.title = newDict.title;
        tmp.description = newDict.description;
        this.saveToFile();
    }

    deleteDict(dictTitle: string): boolean {
        const index = this.allDictionary.findIndex((dict) => dict.title === dictTitle);
        if (index === NOT_FOUND) {
            return false;
        }
        this.allDictionary.splice(index, 1);
        this.saveToFile();
        return true;
    }

    private saveToFile() {
        const fileName = 'assets/customDictionary.json';
        fs.writeFile(fileName, JSON.stringify(this.allDictionary), (err: unknown) => {
            if (err) return console.log(err); // TODO Do something if fail?
        });
    }

    private formatDict(dict: DictionaryServer): DictionaryServer {
        const tmpDict = { title: dict.title, description: dict.description, words: dict.words, canEdit: true };
        return tmpDict;
    }

    // private validateDict(dict: DictionaryServer): boolean {
    //     if (!dict.title || dict.title.length === 0) {
    //         return false;
    //     }
    //     if (!dict.description || dict.description.length === 0) {
    //         return false;
    //     }

    //     if (!dict.words || dict.words.length === 0) {
    //         return false;
    //     }

    //     return true;
    // }
}
