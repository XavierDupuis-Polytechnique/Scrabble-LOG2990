import { Application } from '@app/app';
import { DictionaryServer } from '@app/dictionary-manager/default-dictionary';
import { DictionaryServerService } from '@app/dictionary-manager/dictionary-server.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('DictionaryController', () => {
    let dictionaryServerService: sinon.SinonStubbedInstance<DictionaryServerService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        dictionaryServerService = sinon.createStubInstance(DictionaryServerService);
        const app = Container.get(Application);

        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['dictionaryController'], 'dictionaryServerService', { value: dictionaryServerService });
        expressApp = app.app;
    });

    it('get should return the list of dict', async () => {
        const dictList: DictionaryServer[] = [{ title: 'Test', description: 'Test' }];
        dictionaryServerService.getDictsList.returns(dictList);

        return supertest(expressApp)
            .get('/api/dictionary')
            .expect(StatusCodes.OK)
            .then((res) => {
                const answer = res.body as DictionaryServer[];
                expect(answer).to.deep.equal(dictList);
            });
    });

    it('get should return the specified dict', async () => {
        const dict: DictionaryServer = { title: 'Test', description: 'Test', words: ['aa', 'bb'], canEdit: true };
        dictionaryServerService.getDictByTitle.returns(dict);

        return supertest(expressApp)
            .get('/api/dictionary?title=Test')
            .expect(StatusCodes.OK)
            .then((res) => {
                const answer = res.body as DictionaryServer;
                expect(answer).to.deep.equal(dict);
            });
    });

    it('get should return not found if dict doesnt exist', async () => {
        dictionaryServerService.getDictByTitle.returns(undefined);
        return supertest(expressApp).get('/api/dictionary?title=Test').expect(StatusCodes.NOT_FOUND);
    });

    it('get should throw', async () => {
        dictionaryServerService.getDictsList.throws();
        return supertest(expressApp).get('/api/dictionary').expect(StatusCodes.NOT_FOUND);
    });

    it('post should send true if new dict', async () => {
        const sendData: DictionaryServer = { title: 'Test', description: 'Test', words: ['aa', 'bb'] };
        dictionaryServerService.isDictExist.returns(false);
        return supertest(expressApp)
            .post('/api/dictionary')
            .send(sendData)
            .then((res) => {
                const ans = res.body as boolean;
                expect(ans).to.equal(true);
            });
    });

    it('post should send false if dict already exist', async () => {
        const sendData: DictionaryServer = { title: 'Test', description: 'Test', words: ['aa', 'bb'] };
        dictionaryServerService.isDictExist.returns(true);
        return supertest(expressApp)
            .post('/api/dictionary')
            .send(sendData)
            .then((res) => {
                const ans = res.body as boolean;
                expect(ans).to.equal(false);
            });
    });

    it('post should throw', async () => {
        dictionaryServerService.isDictExist.throws();
        return supertest(expressApp).post('/api/dictionary').expect(StatusCodes.NOT_FOUND);
    });

    it('delete should send OK if dict name is correctly deleted', async () => {
        dictionaryServerService.deleteDict.returns(true);
        return supertest(expressApp).delete('/api/dictionary?title=test').expect(StatusCodes.OK);
    });

    it('delete should send NOT_FOUND if dict name is not found', async () => {
        dictionaryServerService.deleteDict.returns(false);
        return supertest(expressApp).delete('/api/dictionary?title=test').expect(StatusCodes.NOT_FOUND);
    });

    it('delete should throw', async () => {
        dictionaryServerService.deleteDict.throws();
        return supertest(expressApp).delete('/api/dictionary?title=test').expect(StatusCodes.NOT_FOUND);
    });

    it('put should return true', async () => {
        dictionaryServerService.updateDict.returns(true);
        dictionaryServerService.isDictExist.returns(false);
        return supertest(expressApp)
            .put('/api/dictionary')
            .send([
                { title: 'Test', description: 'Test', words: ['aa', 'bb'] },
                { title: 'Test2', description: 'Test', words: ['aa', 'bb'] },
            ])
            .then((res) => {
                const ans = res.body as boolean;
                expect(ans).to.equal(true);
            });
    });

    it('put should return false', async () => {
        dictionaryServerService.updateDict.returns(false);
        dictionaryServerService.isDictExist.returns(true);
        return supertest(expressApp)
            .put('/api/dictionary')
            .send([
                { title: 'Test', description: 'Test', words: ['aa', 'bb'] },
                { title: 'Test2', description: 'Test', words: ['aa', 'bb'] },
            ])
            .then((res) => {
                const ans = res.body as boolean;
                expect(ans).to.equal(false);
            });
    });

    it('put should send status code not found', async () => {
        dictionaryServerService.updateDict.throws();
        return supertest(expressApp).put('/api/dictionary').send({}).expect(StatusCodes.NOT_FOUND);
    });

    it('get drop should drop', async () => {
        return supertest(expressApp)
            .get('/api/dictionary/drop')
            .expect(StatusCodes.OK)
            .then((res) => {
                const answer = res.body as boolean;
                expect(answer).to.deep.equal(true);
            });
    });

    it('get drop should throw', async () => {
        dictionaryServerService.dropDelete.throws();
        return supertest(expressApp)
            .get('/api/dictionary/drop')
            .expect(StatusCodes.OK)
            .then((res) => {
                const answer = res.body as boolean;
                expect(answer).to.deep.equal(false);
            });
    });
});
