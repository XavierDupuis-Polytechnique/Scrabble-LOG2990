/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable dot-notation */
import { LEADERBOARD_CLASSIC_COLLECTION } from '@app/database/leaderboard.service';
import { fail } from 'assert';
import { expect } from 'chai';
// import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';
// chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        databaseService = new DatabaseService();

        // Start a local test server
        mongoServer = await MongoMemoryServer.create();
    });

    afterEach(async () => {
        if (databaseService['client']) {
            await databaseService['client'].close();
        }
    });

    // NB : We dont test the case when DATABASE_URL is used in order to not connect to the real database
    it('should connect to the database when start is called', async () => {
        // Reconnect to local server
        const mongoUri = mongoServer.getUri();
        await databaseService.start(mongoUri);
        expect(databaseService['client']).to.not.be.undefined;
        expect(databaseService['db'].databaseName).to.equal('scrabble');
    });

    it('should not connect to the database when start is called with wrong URL', async () => {
        // Try to reconnect to local server
        try {
            await databaseService.start('WRONG URL');
            fail();
        } catch {
            expect(databaseService['client']).to.be.undefined;
        }
    });

    it('should no longer be connected if close is called', async () => {
        const mongoUri = mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.closeConnection();
        try {
            await databaseService.populateLeaderboardCollection(LEADERBOARD_CLASSIC_COLLECTION);
        } catch (e) {
            expect(e.message).to.deep.eq('Data base collection population error');
        }
    });

    it('should populate the database with a helper function', async () => {
        const mongoUri = mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService['db'] = client.db('scrabble');
        await databaseService.populateLeaderboardCollection(LEADERBOARD_CLASSIC_COLLECTION);
        const scores = await databaseService.database.collection(LEADERBOARD_CLASSIC_COLLECTION).find({}).toArray();
        expect(scores.length).to.equal(5);
    });

    it('should check the collection exists with a helper function', async () => {
        const mongoUri = mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService['db'] = client.db('scrabble');
        let isCollectionExists = await databaseService['collectionExists'](LEADERBOARD_CLASSIC_COLLECTION);
        expect(isCollectionExists).to.be.false;
        databaseService['createLeaderboardCollection'](LEADERBOARD_CLASSIC_COLLECTION);
        isCollectionExists = await databaseService['collectionExists'](LEADERBOARD_CLASSIC_COLLECTION);
        console.log(isCollectionExists);
        expect(isCollectionExists).to.be.true;
    });

    it('should not populate the database with start function if it is already populated', async () => {
        const mongoUri = mongoServer.getUri();
        await databaseService.start(mongoUri);
        let scores = await databaseService.database.collection(LEADERBOARD_CLASSIC_COLLECTION).find({}).toArray();
        console.log(scores);
        expect(scores.length).to.equal(5);
        await databaseService.closeConnection();
        await databaseService.start(mongoUri);
        scores = await databaseService.database.collection(LEADERBOARD_CLASSIC_COLLECTION).find({}).toArray();
        expect(scores.length).to.equal(5);
    });
});
