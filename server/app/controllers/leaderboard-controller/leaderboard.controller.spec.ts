import { Application } from '@app/app';
import { LeaderboardService } from '@app/database/leaderboard-service/leaderboard.service';
import { Score } from '@app/database/leaderboard-service/score.interface';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('LeaderboardController', () => {
    let leaderboardService: sinon.SinonStubbedInstance<LeaderboardService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        leaderboardService = sinon.createStubInstance(LeaderboardService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['leaderboardController'], 'leaderboardService', { value: leaderboardService });
        expressApp = app.app;
    });

    it('should return the right scores of leaderboard for the specific gameMode', async () => {
        const leaderboard: Score[] = [{ name: 'Test', point: 5 }];
        leaderboardService.getScores.resolves(leaderboard);

        return supertest(expressApp)
            .get('/api/scores/gameMode?gameMode=classic')
            .expect(StatusCodes.OK)
            .then((res) => {
                const answer = res.body as Score[];
                expect(answer).to.deep.equal(leaderboard);
            });
    });

    it('should return BAD REQUEST if method cant return scores', async () => {
        leaderboardService.getScores.resolves([]);
        return supertest(expressApp).get('/api/scores/gameMode?gameMode=classic').expect(StatusCodes.BAD_REQUEST);
    });

    it('should return BAD REQUEST if get throws', async () => {
        leaderboardService.getScores.throws();
        return supertest(expressApp).get('/api/scores/gameMode?').expect(StatusCodes.BAD_REQUEST);
    });

    it('should return OK if score was received', async () => {
        const score = { name: 'TEST', point: 10 };
        leaderboardService.updateLeaderboard.resolves(true);
        return supertest(expressApp).post('/api/scores/gameMode?gameMode=classic').send(score).expect(StatusCodes.OK);
    });

    it('should return BAD REQUEST if leaderboard was not updated', async () => {
        const score = { name: 'TEST', point: 10 };
        leaderboardService.updateLeaderboard.resolves(false);
        return supertest(expressApp).post('/api/scores/gameMode?gameMode=classic').send(score).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return BAD REQUEST if update throws', async () => {
        leaderboardService.updateLeaderboard.throws();
        return supertest(expressApp).post('/api/scores/gameMode?gameMode=classic').expect(StatusCodes.BAD_REQUEST);
    });

    it('should return OK if leaderboard was correctly deleted and repopulate', async () => {
        leaderboardService.deleteScores.resolves(true);
        return supertest(expressApp).delete('/api/scores/').expect(StatusCodes.OK);
    });

    it('should return BAD REQUEST if leaderboard was not deleted', async () => {
        leaderboardService.deleteScores.resolves(false);
        return supertest(expressApp).delete('/api/scores/').expect(StatusCodes.BAD_REQUEST);
    });

    it('delete should send BAD REQUEST if method delete throws', async () => {
        leaderboardService.deleteScores.throws();
        return supertest(expressApp).delete('/api/scores/').expect(StatusCodes.BAD_REQUEST);
    });
});
