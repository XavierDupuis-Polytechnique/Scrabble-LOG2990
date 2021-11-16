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
    async isBotExist(botName: string): Promise<boolean> {
        const bot = await this.collection.find({ name: botName }).project({ _id: 0, name: 1, canEdit: 1, type: 1 }).toArray();
        if (bot.length !== 0) {
            return true;
        } else {
            return false;
        }
    }
    async getBotInfoList(): Promise<BotInfo[]> {
        return this.collection.find().toArray();
    }
    async getBotInfoByName(botName: string): Promise<BotInfo> {
        const botInfo = await this.collection.find({ name: botName }).toArray();
        if (botInfo.length === 1) {
            return botInfo[0] as BotInfo;
        } else {
            return {} as BotInfo;
        }
    }

    async addBot(bot: BotInfo) {
        this.collection.insertOne(bot);
    }

    async updateBot(oldBot: BotInfo, newBot: BotInfo) {
        const temp = await this.collection.find({ name: newBot.name }).toArray();
        if (temp.length > 0) {
            return false;
        } else {
            this.collection.updateOne({ name: oldBot.name }, { $set: newBot });
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

    async clearDropCollection() {
        this.collection.deleteMany({ canEdit: true });
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
