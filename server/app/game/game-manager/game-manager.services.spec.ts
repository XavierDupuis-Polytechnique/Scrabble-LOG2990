/* eslint-disable dot-notation */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { NEW_GAME_TIMEOUT } from '@app/constants';
import { LeaderboardService } from '@app/database/leaderboard-service/leaderboard.service';
import { GameActionNotifierService } from '@app/game/game-action-notifier/game-action-notifier.service';
import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { Action } from '@app/game/game-logic/actions/action';
import { ActionCompilerService } from '@app/game/game-logic/actions/action-compiler.service';
import { PassTurn } from '@app/game/game-logic/actions/pass-turn';
import { DEFAULT_DICTIONARY_TITLE } from '@app/game/game-logic/constants';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { EndOfGameReason } from '@app/game/game-logic/interface/end-of-game.interface';
import { ForfeitedGameState } from '@app/game/game-logic/interface/game-state.interface';
import { ObjectiveCreator } from '@app/game/game-logic/objectives/objective-creator/objective-creator.service';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { TimerGameControl } from '@app/game/game-logic/timer/timer-game-control.interface';
import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { GameManagerService, PlayerRef } from '@app/game/game-manager/game-manager.services';
import { GameMode } from '@app/game/game-mode.enum';
import { UserAuth } from '@app/game/game-socket-handler/user-auth.interface';
import { OnlineAction, OnlineActionType } from '@app/game/online-action.interface';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { OnlineGameSettings } from '@app/new-game/online-game.interface';
import { createSinonStubInstance, StubbedClass } from '@app/test.util';
import { expect } from 'chai';
import { before } from 'mocha';
import { Observable } from 'rxjs';
import * as sinon from 'sinon';

describe('GameManagerService', () => {
    let service: GameManagerService;
    let stubPointCalculator: PointCalculatorService;
    let stubMessageService: SystemMessagesService;
    let stubActionCompiler: ActionCompilerService;
    let stubTimerController: TimerController;
    let stubGameCompiler: StubbedClass<GameCompiler>;
    let stubGameActionNotifierService: GameActionNotifierService;
    let stubObjectiveCreator: ObjectiveCreator;
    let stubLeaderboardService: LeaderboardService;
    let stubDictionaryService: DictionaryService;
    let clock: sinon.SinonFakeTimers;
    before(() => {
        stubPointCalculator = createSinonStubInstance<PointCalculatorService>(PointCalculatorService);
        stubMessageService = createSinonStubInstance<SystemMessagesService>(SystemMessagesService);
        stubActionCompiler = createSinonStubInstance<ActionCompilerService>(ActionCompilerService);
        stubGameCompiler = createSinonStubInstance<GameCompiler>(GameCompiler);
        stubTimerController = createSinonStubInstance<TimerController>(TimerController);
        stubGameActionNotifierService = createSinonStubInstance<GameActionNotifierService>(GameActionNotifierService);
        stubObjectiveCreator = createSinonStubInstance<ObjectiveCreator>(ObjectiveCreator);
        stubLeaderboardService = createSinonStubInstance<LeaderboardService>(LeaderboardService);
        stubDictionaryService = createSinonStubInstance<DictionaryService>(DictionaryService);
    });

    afterEach(() => {
        clock.restore();
    });

    beforeEach(() => {
        clock = sinon.useFakeTimers();
        service = new GameManagerService(
            stubPointCalculator,
            stubMessageService,
            stubActionCompiler,
            stubGameCompiler,
            stubTimerController,
            stubGameActionNotifierService,
            stubObjectiveCreator,
            stubLeaderboardService,
            stubDictionaryService,
        );
    });

    it('should create game', () => {
        const gameToken = '1';
        const randomBonus = false;
        const timePerTurn = 60000;
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn,
            playerName,
            opponentName,
            randomBonus,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);
        const game = service.activeGames.get(gameToken) as ServerGame;
        expect(game.randomBonus).to.be.equal(randomBonus);
        expect(game.timePerTurn).to.be.equal(timePerTurn);
        expect(
            game.players.findIndex((player) => {
                return player.name === playerName;
            }),
        ).to.be.not.equal(-1);
        expect(
            game.players.findIndex((player) => {
                return player.name === opponentName;
            }),
        ).to.be.not.equal(-1);
    });

    it('should add players to game and start it', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);
        const userAuth: UserAuth = {
            gameToken: '1',
            playerName,
        };
        const userId = 'abc';
        service.addPlayerToGame(userId, userAuth);
        const playerRef = service.activePlayers.get(userId) as PlayerRef;
        const player = playerRef.player;
        expect(player.name).to.be.equal(playerName);

        const userAuth2: UserAuth = {
            gameToken: '1',
            playerName: opponentName,
        };
        const userId2 = 'def';
        service.addPlayerToGame(userId2, userAuth2);
        const playerRef2 = service.activePlayers.get(userId2) as PlayerRef;
        const player2 = playerRef2.player;
        expect(player2.name).to.be.equal(opponentName);
    });

    it('should throw error when joining a non active game', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);
        const userAuth: UserAuth = {
            gameToken: '2',
            playerName,
        };
        const userId = 'abc';
        expect(() => {
            service.addPlayerToGame(userId, userAuth);
        }).to.throw(Error);
    });

    it('should throw error when joining an invalid name', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);
        const userAuth: UserAuth = {
            gameToken: '1',
            playerName: 'test3',
        };
        const userId = 'abc';
        expect(() => {
            service.addPlayerToGame(userId, userAuth);
        }).to.throw(Error);
    });

    it('should throw error when joining with a already picked name', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);
        const userAuth: UserAuth = {
            gameToken: '1',
            playerName,
        };
        const userId1 = 'abc';
        service.addPlayerToGame(userId1, userAuth);
        const userId2 = 'def';
        expect(() => {
            service.addPlayerToGame(userId2, userAuth);
        }).to.throw(Error);
    });

    it('should throw error when joining with a game that has been removed', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);
        const userAuth: UserAuth = {
            gameToken: '1',
            playerName,
        };
        const userId1 = 'abc';
        service.linkedClients.clear();
        expect(() => {
            service.addPlayerToGame(userId1, userAuth);
        }).to.throw(Error);
    });

    it('should receive a player action', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);
        const userAuth: UserAuth = {
            gameToken: '1',
            playerName,
        };
        const userId = 'abc';
        service.addPlayerToGame(userId, userAuth);
        const onlineAction: OnlineAction = {
            type: OnlineActionType.Pass,
        };
        const spy = sinon.spy();
        stubActionCompiler.translate = spy;
        service.receivePlayerAction(userId, onlineAction);
        expect(spy.calledOnce).to.be.true;
    });

    it('should throw when receiving an action from an inexisting user', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);

        const userId = 'abc';
        const onlineAction: OnlineAction = {
            type: OnlineActionType.Pass,
        };
        expect(() => {
            service.receivePlayerAction(userId, onlineAction);
        }).to.throw(Error);
    });

    it('should do nothing when receiving a not valid user action', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);

        const userAuth: UserAuth = {
            gameToken: '1',
            playerName,
        };
        const userId = 'abc';
        service.addPlayerToGame(userId, userAuth);
        const onlineAction = {
            type: 'allo',
        } as unknown as OnlineAction;
        stubActionCompiler.translate = () => {
            throw Error();
        };
        expect(service.receivePlayerAction(userId, onlineAction)).to.be.undefined;
    });

    it('should remove player from game properly', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);
        const userAuth: UserAuth = {
            gameToken: '1',
            playerName,
        };
        const userId = 'abc';
        service.addPlayerToGame(userId, userAuth);
        service.removePlayerFromGame(userId);
        expect(service.activePlayers.size).to.be.equal(0);
    });

    it('should not throw when removing an inexisting player', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);
        const userId = 'abc';
        expect(() => {
            service.removePlayerFromGame(userId);
        }).to.not.throw(Error);
    });

    it('should not throw when removing a player from a removed game', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameMode = GameMode.Classic;
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode,
        };

        service.createGame(gameToken, gameSettings);
        const userId = 'abc';
        const userAuth: UserAuth = {
            gameToken,
            playerName,
        };
        service.addPlayerToGame(userId, userAuth);
        service.activeGames.delete('1');
        expect(() => {
            service.removePlayerFromGame(userId);
        }).to.not.throw(Error);
        expect(service.activePlayers.size).to.be.equal(0);
    });

    it('should delete game when unjoined for a certain time', async () => {
        const gameSettings: OnlineGameSettings = {
            id: '1',
            timePerTurn: 60000,
            randomBonus: false,
            playerName: 'test1',
            opponentName: 'test2',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };
        service.createGame('1', gameSettings);
        clock.tick(NEW_GAME_TIMEOUT);
        await Promise.resolve();
        expect(service.activeGames.size).to.be.equal(0);
    });

    it('should delete game when linked clients are undefined', async () => {
        const gameSettings: OnlineGameSettings = {
            id: '1',
            timePerTurn: 60000,
            randomBonus: false,
            playerName: 'test1',
            opponentName: 'test2',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };
        service.createGame('1', gameSettings);
        service.linkedClients.clear();
        clock.tick(NEW_GAME_TIMEOUT);
        await Promise.resolve();
        expect(service.activeGames.size).to.be.equal(0);
    });

    it('should not delete joined game after the inactive time', async () => {
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameToken = '1';
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };
        service.createGame(gameToken, gameSettings);

        const userAuth1: UserAuth = {
            gameToken,
            playerName,
        };
        service.addPlayerToGame(gameToken, userAuth1);

        const userAuth2: UserAuth = {
            gameToken,
            playerName: opponentName,
        };
        service.addPlayerToGame(gameToken, userAuth2);
        clock.tick(NEW_GAME_TIMEOUT);
        await Promise.resolve();
        expect(service.activeGames.size).to.be.equal(1);
    });

    it('should not delete linked clients when game is deleted before the time runs out', async () => {
        const gameSettings: OnlineGameSettings = {
            id: '1',
            timePerTurn: 60000,
            randomBonus: false,
            playerName: 'test1',
            opponentName: 'test2',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };
        service.createGame('1', gameSettings);
        service.activeGames.delete('1');
        clock.tick(NEW_GAME_TIMEOUT);
        await Promise.resolve();
        expect(service.linkedClients.size).to.be.equal(0);
    });

    it('should get newGameState$ properly', () => {
        expect(service.newGameState$).to.be.instanceof(Observable);
    });

    it('should get gameState$ properly', () => {
        sinon.stub(stubTimerController, 'timerControl$').get(() => new Observable<TimerGameControl>());
        expect(service.timerControl$).to.be.instanceOf(Observable);
    });

    it('should do nothing when trying to notify an action when no more userlinked', () => {
        const playerName = 'test1';
        const gameToken = '1';
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName: 'test2',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };
        service.createGame('1', gameSettings);

        const userAuth: UserAuth = {
            playerName,
            gameToken,
        };
        const userId = 'abc';
        service.addPlayerToGame(userId, userAuth);
        const onlineAction: OnlineAction = {
            type: OnlineActionType.Pass,
        };
        const player = service.activePlayers.get(userId) as unknown as Player;
        // eslint-disable-next-line no-unused-vars
        stubActionCompiler.translate = (action: OnlineAction): Action => {
            return new PassTurn(player);
        };
        expect(() => {
            service.linkedClients.clear();
            service.receivePlayerAction(userId, onlineAction);
        }).to.not.throw(Error);
    });

    it('should remove game when it finishes and update leaderboard', () => {
        const playerName = 'test1';
        const gameToken = '1';
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName: 'test2',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            gameMode: GameMode.Classic,
        };
        service.createGame(gameToken, gameSettings);
        service['endGame$'].next({ gameToken, reason: EndOfGameReason.GameEnded, players: [] });
        expect(service.activeGames.size).to.be.equal(0);
    });

    it('should not update leaderboard when it finishes on forfeit', () => {
        const player = new Player('test01');
        const gameToken = '1';
        const gameSettings: OnlineGameSettings = {
            gameMode: GameMode.Special,
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName: player.name,
            opponentName: 'test3',
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        service.createGame(gameToken, gameSettings);
        service['endGame$'].next({ gameToken, reason: EndOfGameReason.GameEnded, players: [player] });
        expect(service.activeGames.size).to.be.equal(0);
    });

    it('should create appropriate transition objectives', (done) => {
        const mockGame = {
            activePlayerIndex: 0,
        } as unknown as ServerGame;
        const mockGameState = {} as unknown as ForfeitedGameState;
        service.forfeitedGameState$.subscribe((forfeitedGameState) => {
            expect(forfeitedGameState).to.equal(mockGameState);
            done();
        });
        stubGameCompiler.compileForfeited.returns(mockGameState);
        service['sendForfeitedGameState'](mockGame);
        done();
    });
});
