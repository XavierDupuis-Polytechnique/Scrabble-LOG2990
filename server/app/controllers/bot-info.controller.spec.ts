import { Application } from '@app/app';
import { BotInfoService } from '@app/db-manager-services/bot-info-db-manager/bot-info.service';
import { BotInfo, BotType } from '@app/db-manager-services/bot-name-db-manager/bot-info';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import Container from 'typedi';

describe('BotInfoController', () => {
    let botInfoService: sinon.SinonStubbedInstance<BotInfoService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        botInfoService = sinon.createStubInstance(BotInfoService);
        const app = Container.get(Application);

        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['botInfoController'], 'botInfoService', { value: botInfoService });
        expressApp = app.app;
    });

    it('should return the right bot info', async () => {
        const botInfo: BotInfo[] = [{ name: 'Test', canEdit: false, type: BotType.Easy }];
        botInfoService.getBotInfoList.resolves(botInfo);

        return supertest(expressApp)
            .get('/api/botinfo')
            .expect(StatusCodes.OK)
            .then((res) => {
                const answer = res.body as BotInfo[];
                expect(answer).to.deep.equal(botInfo);
            });
    });

    it('should throws when an error occurs in db', async () => {
        botInfoService.getBotInfoList.throws();
        return supertest(expressApp).get('/api/botinfo').expect(StatusCodes.NOT_FOUND);
    });
});
