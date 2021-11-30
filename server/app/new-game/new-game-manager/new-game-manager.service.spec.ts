/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DEFAULT_DICTIONARY_TITLE } from '@app/game/game-logic/constants';
import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { GameManagerService } from '@app/game/game-manager/game-manager.services';
import { GameMode } from '@app/game/game-mode.enum';
import { NewGameManagerService } from '@app/new-game/new-game-manager/new-game-manager.service';
import { OnlineGameSettings } from '@app/new-game/online-game.interface';
import { createSinonStubInstance, StubbedClass } from '@app/test.util';
import { expect } from 'chai';

describe('NewGameManagerService', () => {
    let gameManagerStub: StubbedClass<GameManagerService>;
    let dictionaryServiceStub: StubbedClass<DictionaryService>;
    let service: NewGameManagerService;
    before(() => {
        gameManagerStub = createSinonStubInstance<GameManagerService>(GameManagerService);
        dictionaryServiceStub = createSinonStubInstance<DictionaryService>(DictionaryService);
        service = new NewGameManagerService(gameManagerStub, dictionaryServiceStub);
    });

    it('should createGame', () => {
        const gameSettings = {
            playerName: 'Max',
            randomBonus: true,
            timePerTurn: 60000,
            gameMode: GameMode.Classic,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        service.createPendingGame(gameSettings);
        expect(service.pendingGames.size).to.equal(1);
    });

    it('on JoinGame should update gameSetting and delete pendingGame', () => {
        gameManagerStub.activeGames = new Map();
        const id = service.getPendingGames()[0].id;
        const playerName = 'Sim';
        service.joinPendingGame(id, playerName);
        expect(service.pendingGames.size).to.equal(0);
    });

    it('on JoinGame should not delete pending game if player join not existing game', () => {
        service.pendingGames.clear();
        const id = 'abc';
        const playerName = 'Sim';
        const confirmedId = service.joinPendingGame(id, playerName);
        expect(confirmedId).to.be.undefined;
    });

    it('on JoinGame should not delete pending game if gameSetting of game are not defined', () => {
        service.pendingGames.clear();
        const gameSetting = undefined as unknown;
        service.pendingGames.set('abc', gameSetting as OnlineGameSettings);
        const id = 'abc';
        const playerName = 'Sim';
        const confirmedId = service.joinPendingGame(id, playerName);
        expect(confirmedId).to.be.undefined;
    });

    it('on JoinGame should not delete pending game if two players are already in gameSetting', () => {
        service.pendingGames.clear();
        const gameSettings = {
            playerName: 'Max',
            opponentName: 'Allo',
            randomBonus: true,
            timePerTurn: 60000,
            gameMode: GameMode.Classic,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        service.pendingGames.set('abc', gameSettings);
        const id = 'abc';
        const playerName = 'Sim';
        const confirmedId = service.joinPendingGame(id, playerName);
        expect(confirmedId).to.be.undefined;
    });

    it('getPendingGame should return correct pending game', () => {
        service.pendingGames.clear();
        const gameSettings = {
            playerName: 'Max',
            randomBonus: true,
            timePerTurn: 60000,
            gameMode: GameMode.Classic,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        service.pendingGames.set('abc', gameSettings);
        const id = 'abc';
        expect(service.getPendingGame(id)).to.deep.equal(gameSettings);
    });

    it('getPendingGame should throw if game does not exist', () => {
        service.pendingGames.clear();
        const id = 'abc';
        try {
            service.getPendingGame(id);
        } catch (error) {
            expect(error.message).to.equal('This game does not exist.');
        }
    });
});
