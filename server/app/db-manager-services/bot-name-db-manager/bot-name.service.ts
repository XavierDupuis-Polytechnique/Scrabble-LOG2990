import { BOT_NAME_COLLECTION, DATABASE_NAME, DATABASE_URL } from '@app/constants';
import { CollectionInfo, Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

interface BotName {
    name: string;
}
@Service()
export class BotNameService {
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
        const isCollectionExist = collections.find((collection: CollectionInfo) => collection.name === BOT_NAME_COLLECTION);
        if (isCollectionExist) {
            return;
        }
        this.createCollection();
    }

    async getBotNames(): Promise<string[]> {
        return this.db
            .collection(BOT_NAME_COLLECTION)
            .find()
            .toArray()
            .then((botNames: BotName[]) => {
                return botNames.map((botName: BotName) => botName.name);
            });
    }

    async addBotName(name: string): Promise<boolean> {
        try {
            await this.db.collection(BOT_NAME_COLLECTION).insertOne({ name });
        } catch (e) {
            return false;
        }
        return true;
    }

    async deleteBotName(name: string): Promise<boolean> {
        try {
            const deleteResult = await this.db.collection(BOT_NAME_COLLECTION).deleteOne({ name });
            const isDeleted = deleteResult.deletedCount === 1 ? true : false;
            return isDeleted;
        } catch (e) {
            return false;
        }
    }

    private async createCollection() {
        try {
            await this.db.createCollection(BOT_NAME_COLLECTION);
            await this.db.collection(BOT_NAME_COLLECTION).createIndex({ name: 1 }, { unique: true });
        } catch (e) {
            throw Error('Data base collection creation error');
        }
    }
}
