import { MAX_FILE_LENGTH } from '@app/constants';
import { DictionaryServer } from '@app/dictionary-manager/default-dictionary';
import { NOT_FOUND } from '@app/game/game-logic/constants';
import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class DictionaryServerService {
    allDictionary: DictionaryServer[] = [];

    constructor(private folderPath = 'assets/') {
        this.loadFromFile();
    }

    isDictExist(dictTitle: string): boolean {
        for (const dict of this.allDictionary) {
            if (dict.title.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH) === dictTitle.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH)) {
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
            if (dict.title !== dictTitle) {
                continue;
            }
            const uniqueName = dictTitle + '_' + dict.date;
            return uniqueName;
        }
        return '';
    }

    getDictByTitle(dictTitle: string): DictionaryServer | undefined {
        return this.allDictionary.find(
            (dictionary) => dictionary.title.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH) === dictTitle.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH),
        );
    }

    addDict(dictToAdd: DictionaryServer): boolean {
        if (this.isDictExist(dictToAdd.title)) {
            return false;
        }
        const dict = this.formatDict(dictToAdd);
        this.allDictionary.push(dict);
        this.saveToFile(dict.title);
        return true;
    }

    updateDict(oldDict: DictionaryServer, newDict: DictionaryServer): boolean {
        const index = this.allDictionary.findIndex((dict) => dict.title === oldDict.title);
        if (index === NOT_FOUND) {
            return false;
        }
        const currentDict = this.allDictionary[index];
        if (!currentDict.canEdit) {
            return false;
        }
        currentDict.title = newDict.title;
        currentDict.description = newDict.description;
        currentDict.date = new Date();
        this.deleteFile(oldDict.title);
        this.saveToFile(currentDict.title);
        return true;
    }

    deleteDict(dictTitle: string): boolean {
        const index = this.allDictionary.findIndex(
            (dict) => dict.title.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH) === dictTitle.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH),
        );
        const dictionary = this.allDictionary[index];
        if (!dictionary) {
            return false;
        }
        if (!dictionary.canEdit) {
            return false;
        }
        this.allDictionary.splice(index, 1);
        this.deleteFile(dictTitle);
        return true;
    }

    dropDelete() {
        for (const dict of this.allDictionary) {
            if (!dict.canEdit) {
                continue;
            }
            this.deleteFile(dict.title);
        }
        this.loadFromFile();
    }

    private deleteFile(dictTitle: string) {
        const title = dictTitle.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH);
        const filePath = this.folderPath + title + '.json';
        fs.unlinkSync(filePath);
    }

    private saveToFile(dictTitle: string) {
        const title = dictTitle.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH);
        const fileName = this.folderPath + title + '.json';
        fs.writeFileSync(fileName, JSON.stringify(this.getDictByTitle(dictTitle)));
    }

    private formatDict(dict: DictionaryServer): DictionaryServer {
        const tmpDict = { title: dict.title, description: dict.description, words: dict.words, canEdit: true, date: new Date() };
        return tmpDict;
    }

    private loadFromFile() {
        this.allDictionary = [];
        fs.readdirSync(this.folderPath).forEach((file) => {
            if (!file.includes('.json')) {
                return;
            }
            const dict = JSON.parse(fs.readFileSync(this.folderPath + file, 'utf8'));
            this.allDictionary.push(dict);
        });
    }
}
