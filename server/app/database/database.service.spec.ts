/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable dot-notation */
import { BOT_INFO_COLLECTION } from '@app/constants';
import { DatabaseService } from '@app/database/database.service';
import { LEADERBOARD_CLASSIC_COLLECTION, LEADERBOARD_LOG_COLLECTION } from '@app/database/leaderboard-service/leaderboard-constants';
import { fail } from 'assert';
import { expect } from 'chai';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let mongoUri: string;

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
    });

    afterEach(async () => {
        if (databaseService['client']) {
            await databaseService['client'].close();
        }
    });

    it('should connect to the database when start is called', async () => {
        await databaseService.start(mongoUri);
        expect(databaseService['db'].databaseName).to.equal('scrabble');
    });

    it('should not connect to the database when start is called with wrong URL', async () => {
        try {
            await databaseService.start('WRONG URL');
            fail();
        } catch {
            expect(databaseService['client']).to.be.undefined;
        }
    });

    it('should no longer be connected if close is called', async () => {
        await databaseService.start(mongoUri);
        try {
            await databaseService['populateLeaderboardCollection'](LEADERBOARD_CLASSIC_COLLECTION);
        } catch (e) {
            expect(e.message).to.deep.eq('Data base collection population error');
        }
    });

    it('should populate the database with a helper function and not populate if it already has data', async () => {
        const client = await MongoClient.connect(mongoUri);
        databaseService['db'] = client.db('scrabble');
        await databaseService['populateLeaderboardCollection'](LEADERBOARD_CLASSIC_COLLECTION);
        let scores = await databaseService.database.collection(LEADERBOARD_CLASSIC_COLLECTION).find({}).toArray();
        expect(scores.length).to.equal(5);
        await databaseService['populateLeaderboardCollection'](LEADERBOARD_CLASSIC_COLLECTION);
        scores = await databaseService.database.collection(LEADERBOARD_CLASSIC_COLLECTION).find({}).toArray();
        expect(scores.length).to.equal(5);
    });

    it('should check the collection exists with a helper function', async () => {
        const client = await MongoClient.connect(mongoUri);
        databaseService['db'] = client.db('scrabble');
        let isCollectionExists = await databaseService['isCollectionInDb'](LEADERBOARD_LOG_COLLECTION);
        expect(isCollectionExists).to.be.false;
        await databaseService['createLeaderboardCollection'](LEADERBOARD_LOG_COLLECTION);
        isCollectionExists = await databaseService['isCollectionInDb'](LEADERBOARD_LOG_COLLECTION);
        expect(isCollectionExists).to.be.true;
    });

    it('should not create and populate if the collection exists', async () => {
        const client = await MongoClient.connect(mongoUri);
        databaseService['db'] = client.db('scrabble');
        await databaseService['createLeaderboardCollection'](LEADERBOARD_LOG_COLLECTION);
        let scores = await databaseService.database.collection(LEADERBOARD_LOG_COLLECTION).find({}).toArray();
        expect(scores.length).to.equal(5);
        await databaseService['createLeaderboardCollection'](LEADERBOARD_LOG_COLLECTION);
        scores = await databaseService.database.collection(LEADERBOARD_LOG_COLLECTION).find({}).toArray();
        expect(scores.length).to.equal(5);
    });

    it('should create the botinfo collection', async () => {
        const client = await MongoClient.connect(mongoUri);
        databaseService['db'] = client.db('scrabble');
        await databaseService['createBotInfoCollection']();
    });

    it('should not create the botinfo collection', async () => {
        const client = await MongoClient.connect(mongoUri);
        databaseService['db'] = client.db('scrabble');
        await databaseService['createBotInfoCollection']();

        let isCollectionExists = await databaseService['isCollectionInDb'](BOT_INFO_COLLECTION);
        expect(isCollectionExists).to.be.true;
        await databaseService['createBotInfoCollection']();
        isCollectionExists = await databaseService['isCollectionInDb'](BOT_INFO_COLLECTION);
        expect(isCollectionExists).to.be.true;
    });
});
