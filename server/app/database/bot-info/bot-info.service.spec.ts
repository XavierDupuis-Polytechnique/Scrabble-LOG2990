import { BotInfo, BotType } from '@app/database/bot-info/bot-info';
import { BotInfoService } from '@app/database/bot-info/bot-info.service';
import { DatabaseServiceMock } from '@app/database/database.service.mock';
import { expect } from 'chai';

describe('BotInfoService', () => {
    let databaseService: DatabaseServiceMock;
    let service: BotInfoService;

    const testBotInfo = [
        {
            name: 'Test',
            type: BotType.Easy,
            canEdit: true,
        },
        {
            name: 'Test2',
            type: BotType.Expert,
            canEdit: false,
        },
    ];
    beforeEach(async () => {
        databaseService = await new DatabaseServiceMock();
        await databaseService.start();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        service = new BotInfoService(databaseService as any);

        await service.collection.insertMany(testBotInfo);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get list', async () => {
        const ans = await service.getBotInfoList();
        expect(ans.length).to.equal(2);
        expect(ans).to.deep.equal(testBotInfo);
    });

    it('should get bot by name', async () => {
        const ans = await service.getBotInfoByName('Test');
        expect(ans).to.deep.equal(testBotInfo[0]);
    });

    it('should return nothing if bot not found by name', async () => {
        const ans = await service.getBotInfoByName('Blablabla');
        expect(ans).to.deep.equal({});
    });

    it('add bot should instert the new bot in the collection', async () => {
        const newBot: BotInfo = {
            name: 'newBot',
            type: BotType.Easy,
            canEdit: true,
        };

        service.addBot(newBot);

        const ans = await service.getBotInfoByName('newBot');
        expect(ans).to.deep.equal(newBot);
    });

    it('updatebot should return true', async () => {
        const editBot: BotInfo = {
            canEdit: true,
            name: 'editBot',
            type: BotType.Easy,
        };

        expect(await service.updateBot(testBotInfo[0], editBot)).to.equal(true);
    });

    it('updatebot should return false', async () => {
        const editBot: BotInfo = {
            canEdit: true,
            name: 'Test2',
            type: BotType.Easy,
        };

        expect(await service.updateBot(testBotInfo[0], editBot)).to.equal(false);
    });

    it('deleteBot should return true', async () => {
        expect(await service.deleteBot(testBotInfo[0])).to.equal(true);
    });

    it('dropCollection should drop all expect default bot', async () => {
        await service.clearDropCollection();
        const ans = await service.getBotInfoList();
        const numberDefaultBot = 6;
        expect(ans.length).to.equal(numberDefaultBot);
    });

    it('isBotExist should return true', async () => {
        const ans = await service.isBotExist('Test');
        expect(ans).to.equal(true);
    });

    it('isBotExit should return false', async () => {
        const ans = await service.isBotExist('DumbNameHere');
        expect(ans).to.equal(false);
    });
});
