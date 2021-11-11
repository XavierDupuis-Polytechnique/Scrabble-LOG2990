import { BOT_NAME_COLLECTION, DATABASE_NAME, DATABASE_URL } from '@app/constants';
import { Db, MongoClient } from 'mongodb';
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
        const isCollectionExist = (await this.db.collection(BOT_NAME_COLLECTION).countDocuments()) !== 0;
        if (!isCollectionExist) {
            await this.db.createCollection(BOT_NAME_COLLECTION);
            const names = ['aaa', 'bbb', 'ccc'];
            for (const name of names) {
                await this.db.collection(BOT_NAME_COLLECTION).insertOne({ name });
            }
        }
    }

    async getBotNames(): Promise<string[]> {
        return this.db.collection(BOT_NAME_COLLECTION)
            .find()
            .toArray()
            .then((botNames: BotName[]) => {
                return botNames.map((botName: BotName) => botName.name);
            });
    }
}
