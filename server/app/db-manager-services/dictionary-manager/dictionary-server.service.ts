import { DictionaryServer } from '@app/db-manager-services/dictionary-manager/default-dictionary';
import { NOT_FOUND } from '@app/game/game-logic/constants';
// import customDictionary from 'assets/customDictionary.json';
import * as fs from 'fs';
import { Service } from 'typedi';

const folderPath = 'assets/';
@Service()
export class DictionaryServerService {
    allDictionary: DictionaryServer[] = [];

    constructor() {
        this.start();
    }

    start() {
        fs.readdirSync(folderPath).forEach((file) => {
            const dictPath = folderPath + file;
            const dictData = fs.readFileSync(dictPath).toString();
            const dictObj = JSON.parse(dictData);
            this.allDictionary.push(dictObj);
        });
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

    getUniqueName(dictTitle: string): string {
        for (const dict of this.allDictionary) {
            if (dict.title === dictTitle) {
                const uniqueName = dictTitle + '_' + dict.date;
                return uniqueName;
            }
        }
        return '';
    }

    getDictByTitle(dictTitle: string): DictionaryServer | boolean {
        for (const dict of this.allDictionary) {
            if (dict.title === dictTitle) {
                return dict;
            }
        }
        return false;
    }

    addDict(dictToAdd: DictionaryServer) {
        const dict = this.formatDict(dictToAdd);
        this.allDictionary.push(dict);
        this.saveToFile(dict.title);
    }

    updateDict(oldDict: DictionaryServer, newDict: DictionaryServer): boolean {
        const index = this.allDictionary.findIndex((dict) => dict.title === oldDict.title);
        const currentDict = this.allDictionary[index];
        if (currentDict.canEdit) {
            currentDict.title = newDict.title;
            currentDict.description = newDict.description;
            currentDict.date = new Date();
            this.deleteFile(oldDict.title);
            this.saveToFile(currentDict.title);
            return true;
        }
        return false;
    }

    deleteDict(dictTitle: string): boolean {
        const index = this.allDictionary.findIndex((dict) => dict.title === dictTitle);
        if (index === NOT_FOUND) {
            return false;
        }
        if (!this.allDictionary[index].canEdit) {
            return false;
        }
        this.allDictionary.splice(index, 1);
        this.deleteFile(dictTitle);
        return true;
    }

    dropDelete() {
        for (const dict of this.allDictionary) {
            if (dict.canEdit) {
                this.deleteDict(dict.title);
            }
        }
    }

    private deleteFile(dictTitle: string) {
        const filePath = (folderPath + dictTitle + '.json').replace(/\s/g, '');
        fs.rmSync(filePath);
    }

    private saveToFile(dictTitle: string) {
        const fileName = (folderPath + dictTitle + '.json').replace(/\s/g, '');
        fs.writeFile(fileName, JSON.stringify(this.getDictByTitle(dictTitle)), () => {
            return false; // TODO Do something if fail?
        });
    }

    private formatDict(dict: DictionaryServer): DictionaryServer {
        const tmpDict = { title: dict.title, description: dict.description, words: dict.words, canEdit: true, date: new Date() };
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
