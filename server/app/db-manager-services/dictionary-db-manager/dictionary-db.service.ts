import { DATABASE_NAME, DATABASE_URL, DICTIONARY_COLLECTION } from '@app/constants';
import { CollectionInfo, Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class DictionaryDbService {
    client: MongoClient;
    db: Db;

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
            return;
        }
        this.createCollection();
        this.populateCollection();
    }

    private async createCollection() {
        try {
            await this.db.createCollection(DICTIONARY_COLLECTION);
            await this.db.collection(DICTIONARY_COLLECTION).createIndex({ name: 1 }, { unique: true });
        } catch (e) {
            throw Error('Data base collection creation error');
        }
    }

    private async populateCollection() {
        const defaultDictionary = DEFAULT_BOT_NAMES.map((name: string) => {
            return { name };
        });
        try {
            await this.db.collection(BOT_NAME_COLLECTION).insertMany(botNames);
        } catch (e) {
            throw Error('Data base collection population error');
        }
    }
}
