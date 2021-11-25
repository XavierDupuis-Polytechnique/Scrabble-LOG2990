import { Application } from '@app/app';
import { BotInfo, BotType } from '@app/database/bot-info/bot-info';
import { BotInfoService } from '@app/database/bot-info/bot-info.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

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

    it('get should return the right bot info', async () => {
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

    it('get should throw', async () => {
        botInfoService.getBotInfoList.throws();
        return supertest(expressApp).get('/api/botinfo').expect(StatusCodes.NOT_FOUND);
    });

    it('post should send true if new bot', async () => {
        const sendData: BotInfo = { name: 'Test', type: BotType.Easy, canEdit: true };
        botInfoService.isBotExist.resolves(false);
        return supertest(expressApp)
            .post('/api/botinfo')
            .send(sendData)
            .then((res) => {
                const ans = res.body as boolean;
                expect(ans).to.equal(true);
            });
    });

    it('post should send false if bot already exist', async () => {
        const sendData: BotInfo = { name: 'Test', type: BotType.Easy, canEdit: true };
        botInfoService.isBotExist.resolves(true);
        return supertest(expressApp)
            .post('/api/botinfo')
            .send(sendData)
            .then((res) => {
                const ans = res.body as boolean;
                expect(ans).to.equal(false);
            });
    });

    it('post should throw', async () => {
        botInfoService.isBotExist.throws();
        return supertest(expressApp).post('/api/botinfo').expect(StatusCodes.NOT_FOUND);
    });

    it('delete should send OK if bot name is correctly deleted', async () => {
        return supertest(expressApp).delete('/api/botinfo/Test').expect(StatusCodes.OK);
    });

    it('delete should send OK if bot name is correctly deleted', async () => {
        botInfoService.getBotInfoByName.throws();
        return supertest(expressApp).delete('/api/botinfo/Test').expect(StatusCodes.NOT_FOUND);
    });

    it('put should return true', async () => {
        botInfoService.updateBot.resolves(true);
        return supertest(expressApp)
            .put('/api/botinfo')
            .send({})
            .then((res) => {
                const ans = res.body as boolean;
                expect(ans).to.equal(true);
            });
    });

    it('put should return true', async () => {
        botInfoService.updateBot.resolves(false);
        return supertest(expressApp)
            .put('/api/botinfo')
            .send({})
            .then((res) => {
                const ans = res.body as boolean;
                expect(ans).to.equal(false);
            });
    });

    it('put should send status code not found', async () => {
        botInfoService.updateBot.throws();
        return supertest(expressApp).put('/api/botinfo').send({}).expect(StatusCodes.NOT_FOUND);
    });

    it('drop should send true', async () => {
        botInfoService.clearDropCollection.resolves();
        return supertest(expressApp)
            .get('/api/botinfo/drop')
            .then((res) => {
                const ans = res.body as boolean;
                expect(ans).to.equal(true);
            });
    });

    it('drop should send false', async () => {
        botInfoService.clearDropCollection.throws();
        return supertest(expressApp)
            .get('/api/botinfo/drop')
            .then((res) => {
                const ans = res.body as boolean;
                expect(ans).to.equal(false);
            });
    });
});
