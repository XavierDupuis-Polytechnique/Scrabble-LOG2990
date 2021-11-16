import { DATABASE_NAME, DATABASE_URL, DICTIONARY_COLLECTION } from '@app/constants';
import { DEFAULT_DICTIONARY, DictionaryDb } from '@app/db-manager-services/dictionary-db-manager/default-dictionary';
import { Collection, CollectionInfo, Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class DictionaryDbService {
    client: MongoClient;
    db: Db;
    collection: Collection;

    constructor() {
        this.start();
    }

    async start() {
        try {
            this.client = await MongoClient.connect(DATABASE_URL);
            this.db = this.client.db(DATABASE_NAME);
        } catch (error) {
            throw Error('Data base connection error');
        }
        const collections = await this.db.listCollections().toArray();
        const isCollectionExist = collections.find((collection: CollectionInfo) => collection.name === DICTIONARY_COLLECTION);
        if (isCollectionExist) {
            this.collection = this.db.collection(DICTIONARY_COLLECTION);
            return;
        }
        this.createCollection();
        this.populateCollection();
    }

    async isDictExist(dictName: string): Promise<boolean> {
        const dicts = await this.collection.find({ title: dictName }).project({ _id: 0 }).toArray();
        if (dicts.length !== 0) {
            return true;
        } else {
            return false;
        }
    }

    async getDictsList(): Promise<DictionaryDb[]> {
        return this.collection.find().project({ words: 0 }).toArray();
    }

    async getDictByTitle(dictName: string): Promise<DictionaryDb> {
        const dict = await this.collection.find({ title: dictName }).toArray();
        if (dict.length === 1) {
            return dict[0] as DictionaryDb;
        } else {
            return {} as DictionaryDb;
        }
    }

    async addDict(dict: DictionaryDb) {
        this.collection.insertOne(dict);
    }

    async updateDict(oldDict: DictionaryDb, newDict: DictionaryDb) {
        const temp = await this.collection.find({ title: newDict.title }).toArray();
        if (temp.length > 0) {
            return false;
        } else {
            this.collection.updateOne({ title: oldDict.title }, { $set: newDict });
            return true;
        }
    }

    async deleteDict(dict: DictionaryDb): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.collection.deleteOne(dict, (err) => {
                if (err) resolve(false);
                else resolve(true);
            });
        });
    }

    private async createCollection() {
        try {
            await this.db.createCollection(DICTIONARY_COLLECTION);
            this.collection = this.db.collection(DICTIONARY_COLLECTION);
            await this.db.collection(DICTIONARY_COLLECTION).createIndex({ title: 1 }, { unique: true });
        } catch (e) {
            throw Error('Data base collection creation error');
        }
    }

    private async populateCollection() {
        try {
            await this.db.collection(DICTIONARY_COLLECTION).insertOne(DEFAULT_DICTIONARY);
        } catch (e) {
            throw Error('Data base collection population error');
        }
    }
}
