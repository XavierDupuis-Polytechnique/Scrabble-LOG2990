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
        console.log(this.allDictionary);
        // this.saveToFile(this.allDictionary[1].title);
        // console.log(this.allDictionary);
        this.deleteDict(this.allDictionary[3].title);
        console.log('aslkdnlasdnjasndkja');
        console.log(this.allDictionary);
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
        this.saveToFile(dict.title);
    }

    updateDict(oldDict: DictionaryServer, newDict: DictionaryServer) {
        const index = this.allDictionary.findIndex((dict) => dict.title === oldDict.title);
        const tmp = this.allDictionary[index];
        tmp.title = newDict.title;
        tmp.description = newDict.description;
        this.saveToFile(tmp.title);
    }

    deleteDict(dictTitle: string): boolean {
        const index = this.allDictionary.findIndex((dict) => dict.title === dictTitle);
        if (index === NOT_FOUND) {
            return false;
        }
        this.allDictionary.splice(index, 1);
        this.deleteFile(dictTitle);
        return true;
    }

    private deleteFile(dictTitle: string): boolean {
        const filePath = folderPath + dictTitle + '.json';
        if (!fs.existsSync(filePath)) {
            return false;
        }
        fs.rmSync(filePath);
        return true;
    }

    private saveToFile(dictTitle: string) {
        const fileName = (folderPath + dictTitle + '.json').replace(/\s/g, '');
        fs.writeFile(fileName, JSON.stringify(this.getDictByTitle(dictTitle)), (err: unknown) => {
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
