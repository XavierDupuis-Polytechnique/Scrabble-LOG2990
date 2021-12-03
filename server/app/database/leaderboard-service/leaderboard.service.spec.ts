/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable dot-notation */
import { DatabaseServiceMock } from '@app/database/database.service.mock';
import { LeaderboardService } from '@app/database/leaderboard-service/leaderboard.service';
import { Score } from '@app/database/leaderboard-service/score.interface';
import { GameMode } from '@app/game/game-mode.enum';
import { expect } from 'chai';
import { MongoClient } from 'mongodb';

describe('Leaderboard Service', () => {
    let databaseService: DatabaseServiceMock;
    let leaderboardService: LeaderboardService;
    let client: MongoClient;
    let testScore: Score;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        client = (await databaseService.start()) as MongoClient;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        leaderboardService = new LeaderboardService(databaseService as any);
        testScore = {
            name: 'Player1',
            point: 50,
        };
        await leaderboardService['getLeaderboardCollection'](GameMode.Classic).insertOne({ name: testScore.name, point: testScore.point });
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get correct collection from DB', async () => {
        const collection = leaderboardService['getLeaderboardCollection'](GameMode.Classic);
        expect(collection.collectionName).to.equal('leaderboardClassic');
    });

    it('should get all scores from DB collection classic', async () => {
        const scores = await leaderboardService.getScores(GameMode.Classic);
        expect(scores.length).to.equal(1);
        expect(scores[0].name).to.deep.equals(testScore.name);
    });

    it('should insert a new score', async () => {
        const newScore: Score = {
            name: 'Player2',
            point: 20,
        };

        await leaderboardService.updateLeaderboard(newScore, GameMode.Classic);
        const scores = await leaderboardService['getLeaderboardCollection'](GameMode.Classic).find({}).toArray();
        expect(scores.length).to.equal(2);
        expect(scores.find((x) => x.name === newScore.name)?.name).to.deep.equals(newScore.name);
    });

    it('should modify score', async () => {
        const updatedScore: Score = {
            name: 'Player1',
            point: 60,
        };

        await leaderboardService.updateLeaderboard(updatedScore, GameMode.Classic);
        const scores = await leaderboardService['getLeaderboardCollection'](GameMode.Classic).find({}).toArray();
        expect(scores.length).to.equal(1);
        expect(scores[0].name).to.deep.equals(updatedScore.name);
        expect(scores[0].point).to.deep.equals(updatedScore.point);
    });

    it('should not modify score if score is less than last', async () => {
        const updatedScore: Score = {
            name: 'Player1',
            point: 10,
        };

        await leaderboardService.updateLeaderboard(updatedScore, GameMode.Classic);
        const scores = await leaderboardService['getLeaderboardCollection'](GameMode.Classic).find({}).toArray();
        expect(scores.length).to.equal(1);
        expect(scores[0].name).to.deep.equals(testScore.name);
        expect(scores[0].point).to.deep.equals(testScore.point);
    });

    it('should return false if modify throws', async () => {
        await client.close();
        const updatedScore: Score = {
            name: 'Player1',
            point: 10,
        };
        const isSuccesful = await leaderboardService.updateLeaderboard(updatedScore, GameMode.Classic);
        expect(isSuccesful).to.be.false;
    });

    it('should return false if add throws', async () => {
        await client.close();
        const updatedScore: Score = {
            name: 'Player2',
            point: 10,
        };
        const isSuccesful = await leaderboardService.updateLeaderboard(updatedScore, GameMode.Classic);
        expect(isSuccesful).to.be.false;
    });

    it('should delete and repopulate collection', async () => {
        await leaderboardService.deleteScores();
        const numberDefaultScore = 5;
        const scores = await leaderboardService['getLeaderboardCollection'](GameMode.Classic).find({}).toArray();
        expect(scores.length).to.equal(numberDefaultScore);
    });

    it('should not delete and repopulate collection if delete throws', async () => {
        databaseService.start();
        await client.close();
        const isSuccesful = await leaderboardService.deleteScores();
        expect(isSuccesful).to.be.false;
    });
});
