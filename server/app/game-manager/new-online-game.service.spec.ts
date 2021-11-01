/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { OnlineGameSettings } from './game-settings-multi.interface';
import { NewOnlineGameService } from './new-online-game.service';

const mockGameManager = {
    createGame: () => {
        return;
    },
};
describe('NewOnlineGameService', () => {
    let service: NewOnlineGameService;
    before(() => {
        service = new NewOnlineGameService(mockGameManager);
    });

    it('should createGame', (done) => {
        const gameSettings = { playerName: 'Max', randomBonus: true, timePerTurn: 60000 };
        service.createPendingGame(gameSettings);
        expect(service.pendingGames.size).to.equal(1);
        done();
    });

    it('on JoinGame should update gameSetting and delete pendingGame', (done) => {
        const id = service.getPendingGames()[0].id;
        const playerName = 'Sim';
        service.joinPendingGame(id, playerName);
        expect(service.pendingGames.size).to.equal(0);
        done();
    });

    it('on JoinGame should not delete pending game if player join not existing game', (done) => {
        service.pendingGames.clear();
        const id = 'abc';
        const playerName = 'Sim';
        const confirmedId = service.joinPendingGame(id, playerName);
        expect(confirmedId).to.be.undefined;
        done();
    });

    it('on JoinGame should not delete pending game if gameSetting of game are not defined', (done) => {
        service.pendingGames.clear();
        const gameSetting = undefined as unknown;
        service.pendingGames.set('abc', gameSetting as OnlineGameSettings);
        const id = 'abc';
        const playerName = 'Sim';
        const confirmedId = service.joinPendingGame(id, playerName);
        expect(confirmedId).to.be.undefined;
        done();
    });

    it('on JoinGame should not delete pending game if two players are already in gameSetting', (done) => {
        service.pendingGames.clear();
        const gameSettings = { playerName: 'Max', opponentName: 'Allo', randomBonus: true, timePerTurn: 60000 };
        service.pendingGames.set('abc', gameSettings);
        const id = 'abc';
        const playerName = 'Sim';
        const confirmedId = service.joinPendingGame(id, playerName);
        expect(confirmedId).to.be.undefined;
        done();
    });
});
