import { Application } from '@app/app';
import { LeaderboardService, Score } from '@app/database/leaderboard.service';
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

    it('should return NOT FOUND if get throws', async () => {
        leaderboardService.getScores.throws();
        return supertest(expressApp).get('/api/scores/gameMode?').expect(StatusCodes.NOT_FOUND);
    });

    it('should return OK if score was received', async () => {
        const score = { name: 'TEST', point: 10 };
        return supertest(expressApp).post('/api/scores/gameMode?gameMode=classic').send(score).expect(StatusCodes.OK);
    });

    it('should return BAD REQUEST if update throws', async () => {
        leaderboardService.updateLeaderboard.throws();
        return supertest(expressApp).post('/api/scores/gameMode?gameMode=classic').expect(StatusCodes.BAD_REQUEST);
    });

    it('should return OK if leaderboard was correctly deleted and repopulate', async () => {
        return supertest(expressApp).delete('/api/scores/gameMode?gameMode=classic').expect(StatusCodes.OK);
    });

    it('delete should send BAD REQUEST if method delete throws', async () => {
        leaderboardService.deleteScores.throws();
        return supertest(expressApp).delete('/api/scores/gameMode?gameMode=classic').expect(StatusCodes.BAD_REQUEST);
    });
});
