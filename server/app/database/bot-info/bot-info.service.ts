import { BOT_INFO_COLLECTION } from '@app/constants';
import { BotInfo } from '@app/database/bot-info/bot-info';
import { DEFAULT_EASY_BOT, DEFAULT_EXPERT_BOT } from '@app/database/bot-info/default-bot-names';
import { DatabaseService } from '@app/database/database.service';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class BotInfoService {
    constructor(private dbService: DatabaseService) {}

    get collection(): Collection<BotInfo> {
        return this.dbService.database.collection(BOT_INFO_COLLECTION);
    }

    async isBotExist(botName: string): Promise<boolean> {
        const results = await this.collection.find({ name: botName }).project({ _id: 0, name: 1, canEdit: 1, type: 1 }).toArray();
        return results.length !== 0;
    }

    async getBotInfoList(): Promise<BotInfo[]> {
        return this.collection.find().toArray();
    }

    async getBotInfoByName(botName: string): Promise<BotInfo> {
        const botInfo = await this.collection.find({ name: botName }).toArray();
        return botInfo.length === 1 ? botInfo[0] : ({} as BotInfo);
    }

    async addBot(bot: BotInfo) {
        this.collection.insertOne(bot);
    }

    async updateBot(oldBot: BotInfo, newBot: BotInfo) {
        const temp = await this.collection.find({ name: newBot.name }).toArray();
        if (temp.length <= 0) {
            this.collection.updateOne({ name: oldBot.name }, { $set: newBot });
            return true;
        }
        return false;
    }

    async deleteBot(bot: BotInfo): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.collection.deleteOne(bot, (err) => {
                const isDeleted = err === undefined;
                resolve(isDeleted);
            });
        });
    }

    async clearDropCollection() {
        await this.collection.drop();
        await this.collection.insertMany(DEFAULT_EASY_BOT);
        await this.collection.insertMany(DEFAULT_EXPERT_BOT);
    }
}
