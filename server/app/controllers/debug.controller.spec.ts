import { Application } from '@app/app';
import { LetterBag } from '@app/game/game-logic/board/letter-bag';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { GameManagerService } from '@app/game/game-manager/game-manager.services';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_ERROR_NOT_FOUND = StatusCodes.NOT_FOUND;
const HTTP_BAD_REQUEST = StatusCodes.BAD_REQUEST;

describe('ServerGameController', () => {
    let gameManagerService: SinonStubbedInstance<GameManagerService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gameManagerService = createStubInstance(GameManagerService);
        const mockActiveGame = new Map<string, SinonStubbedInstance<ServerGame>>();
        const letter: Letter = { char: 'A', value: 1 };
        const mockLetterBag = {
            gameLetters: [letter, letter, letter],
            countLetters: () => {
                const map = new Map<string, number>();
                map.set('A', 3);
                return map;
            },
        };

        const mockGame = createStubInstance(ServerGame);
        mockGame.letterBag = mockLetterBag as LetterBag;

        mockActiveGame.set('2', mockGame);

        gameManagerService.activeGames = mockActiveGame as unknown as Map<string, ServerGame>;

        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['debugController'], 'gameManager', { value: gameManagerService });
        expressApp = app.app;
    });

    it('Should return the right number of letter for the specific gameID', async () => {
        return supertest(expressApp)
            .get('/api/servergame/letterbag?gameId=2')
            .expect(HTTP_STATUS_OK)
            .then((res) => {
                const answer = Object.entries(res.body);
                expect(answer[0][1]).to.equal(3);
            });
    });

    it('Should return 404 code when no active with GameId is found', async () => {
        return supertest(expressApp).get('/api/servergame/letterbag?gameId=3').expect(HTTP_ERROR_NOT_FOUND);
    });

    it('Should return 400 code when no gameId is provided', async () => {
        return supertest(expressApp).get('/api/servergame/letterbag').expect(HTTP_BAD_REQUEST);
    });
});
