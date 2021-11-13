import { Application } from '@app/app';
import { BotNamesService } from '@app/db-manager-services/bot-name-db-manager/bot-names.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import Container from 'typedi';

describe('BotNamesController', () => {
    let botnamesService: sinon.SinonStubbedInstance<BotNamesService>;
    let expressApp: Express.Application;
    beforeEach(async () => {
        botnamesService = sinon.createStubInstance(BotNamesService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['botNamesController'], 'botNamesService', { value: botnamesService });
        expressApp = app.app;
    });

    it('should return the right bot names', async () => {
        const botNames = ['bot1', 'bot2'];
        botnamesService.getBotNames.resolves(botNames);
        return supertest(expressApp)
            .get('/api/botnames')
            .expect(StatusCodes.OK)
            .then((res) => {
                const answer = res.body as string[];
                expect(answer).to.deep.equal(botNames);
            });
    });

    it('should throws when an error occurs in db', async () => {
        botnamesService.getBotNames.throws();
        return supertest(expressApp).get('/api/botnames').expect(StatusCodes.NOT_FOUND);
    });

    it('should send bad request when posting bad request when posting wrong data', async () => {
        return supertest(expressApp).post('/api/botnames').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return created status when bot added to db with success', async () => {
        botnamesService.addBotName.resolves(true);
        return supertest(expressApp).post('/api/botnames').send({ name: 'bot1' }).expect(StatusCodes.CREATED);
    });

    it('should return conflict status when bot already added to db', async () => {
        botnamesService.addBotName.resolves(false);
        return supertest(expressApp).post('/api/botnames').send({ name: 'bot1' }).expect(StatusCodes.CONFLICT);
    });

    it('should return service unavaailable when botnamesService throws when adding name', async () => {
        botnamesService.addBotName.throws();
        return supertest(expressApp).post('/api/botnames').send({ name: 'bot1' }).expect(StatusCodes.SERVICE_UNAVAILABLE);
    });

    it('should return bad request when deleting botnames when invalid json object', async () => {
        return supertest(expressApp).delete('/api/botnames').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return OK status when bot name successfully deleted', async () => {
        botnamesService.deleteBotName.resolves(true);
        return supertest(expressApp).delete('/api/botnames').send({ name: 'bot1' }).expect(StatusCodes.OK);
    });

    it('should return not found status when bot name was not deleted', async () => {
        botnamesService.deleteBotName.resolves(false);
        return supertest(expressApp).delete('/api/botnames').send({ name: 'bot1' }).expect(StatusCodes.NOT_FOUND);
    });

    it('should return service unavailable status when botnamesServices throws when deleting', async () => {
        botnamesService.deleteBotName.throws();
        return supertest(expressApp).delete('/api/botnames').send({ name: 'bot1' }).expect(StatusCodes.SERVICE_UNAVAILABLE);
    });
});
