import { BOT_INFO_COLLECTION, DATABASE_NAME, DATABASE_URL } from '@app/constants';
import { BotInfo } from '@app/db-manager-services/bot-name-db-manager/bot-info';
import { DEFAULT_EASY_BOT } from '@app/db-manager-services/bot-name-db-manager/default-bot-names';
import { Collection, CollectionInfo, Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class BotInfoService {
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
            throw Error('Database connection error');
        }
        const collections = await this.db.listCollections().toArray();
        const isCollectionExist = collections.find((collection: CollectionInfo) => collection.name === BOT_INFO_COLLECTION);
        if (isCollectionExist) {
            this.collection = this.db.collection(BOT_INFO_COLLECTION);
            return;
        } else {
            await this.createCollection();
            await this.populateCollection();
        }
    }
    async findBotByName(botName: string) {
        const test = await this.collection.find({ name: botName }).toArray();
        console.log(test);
    }
    async getBotInfoList(): Promise<BotInfo[]> {
        return this.collection.find().toArray();
    }

    async addBot(bot: BotInfo) {
        const isBotExist = await this.collection.find({ name: bot.name }).toArray();
        if (isBotExist.length !== 0) {
            return false;
        } else {
            this.collection.insertOne(bot);
            return true;
        }
    }

    async deleteBot(bot: BotInfo): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.collection.deleteOne(bot, (err) => {
                if (err) resolve(false);
                else resolve(true);
            });
        });
    }

    private async createCollection() {
        try {
            await this.db.createCollection(BOT_INFO_COLLECTION);
            this.collection = this.db.collection(BOT_INFO_COLLECTION);
            await this.db.collection(BOT_INFO_COLLECTION).createIndex({ name: 1 }, { unique: true });
        } catch (e) {
            throw Error('Database collection creation error');
        }
    }

    private async populateCollection() {
        try {
            await this.collection.insertMany(DEFAULT_EASY_BOT);
        } catch (e) {
            throw Error('Database collection population error');
        }
    }
}
