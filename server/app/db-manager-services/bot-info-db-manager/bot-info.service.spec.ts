import { MongoClient } from 'mongodb';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { BotInfoService } from './bot-info.service';

describe('BotInfo Service', () => {
    let botInfoService: BotInfoService;

    let mockMongoClient: SinonStubbedInstance<MongoClient>;

    beforeEach(() => {
        botInfoService = new BotInfoService();
        mockMongoClient = createStubInstance<MongoClient>(MongoClient);
    });

    it('');
});
