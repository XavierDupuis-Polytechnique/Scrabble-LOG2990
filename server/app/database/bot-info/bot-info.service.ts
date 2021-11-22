import { BOT_INFO_COLLECTION } from '@app/constants';
import { BotInfo } from '@app/database/bot-info/bot-info';
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
}
