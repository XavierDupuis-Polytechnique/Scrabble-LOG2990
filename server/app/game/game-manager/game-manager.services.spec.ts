/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { NEW_GAME_TIMEOUT } from '@app/constants';
import { GameActionNotifierService } from '@app/game/game-action-notifier/game-action-notifier.service';
import { ActionCompilerService } from '@app/game/game-logic/actions/action-compiler.service';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { TimerGameControl } from '@app/game/game-logic/timer/timer-game-control.interface';
import { GameManagerService, PlayerRef } from '@app/game/game-manager/game-manager.services';
import { UserAuth } from '@app/game/game-socket-handler/user-auth.interface';
import { OnlineAction, OnlineActionType } from '@app/game/online-action.interface';
import { SystemMessagesService } from '@app/messages-service/system-messages.service';
import { OnlineGameSettings } from '@app/online-game-init/game-settings-multi.interface';
import { GameCompiler } from '@app/services/game-compiler.service';
import { createSinonStubInstance } from '@app/test.util';
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
    let stubGameCompiler: GameCompiler;
    let stubGameActionNotifierService: GameActionNotifierService;
    const clock = sinon.useFakeTimers();
    before(() => {
        stubPointCalculator = createSinonStubInstance<PointCalculatorService>(PointCalculatorService);
        stubMessageService = createSinonStubInstance<SystemMessagesService>(SystemMessagesService);
        stubActionCompiler = createSinonStubInstance<ActionCompilerService>(ActionCompilerService);
        stubGameCompiler = createSinonStubInstance<GameCompiler>(GameCompiler);
        stubTimerController = createSinonStubInstance<TimerController>(TimerController);
        stubGameActionNotifierService = createSinonStubInstance<GameActionNotifierService>(GameActionNotifierService);
    });

    afterEach(() => {
        clock.restore();
    });

    beforeEach(() => {
        service = new GameManagerService(
            stubPointCalculator,
            stubMessageService,
            stubActionCompiler,
            stubGameCompiler,
            stubTimerController,
            stubGameActionNotifierService,
        );
    });

    it('should create game', () => {
        const gameToken = '1';
        const randomBonus = false;
        const timePerTurn = 60000;
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn,
            playerName,
            opponentName,
            randomBonus,
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
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
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
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
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
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
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
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
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
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
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
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
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
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
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
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
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
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
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

    it('should throw when removing an inexisting player', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
        };

        service.createGame(gameToken, gameSettings);
        const userId = 'abc';
        expect(() => {
            service.removePlayerFromGame(userId);
        }).to.throw(Error);
    });

    it('should throw when removing a player from a removed game', () => {
        const gameToken = '1';
        const playerName = 'test1';
        const opponentName = 'test2';
        const gameSettings: OnlineGameSettings = {
            id: gameToken,
            timePerTurn: 60000,
            randomBonus: false,
            playerName,
            opponentName,
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
        }).to.throw(Error);
    });

    it('should delete game when unjoined for a certain time', async () => {\
        // TODO: Fix this test
        const gameSettings: OnlineGameSettings = {
            id: '1',
            timePerTurn: 60000,
            randomBonus: false,
            playerName: 'test1',
            opponentName: 'test2',
        };
        service.createGame('1', gameSettings);
        clock.tick(3 * NEW_GAME_TIMEOUT);
        await Promise.resolve();
        service.activeGames.delete('1');
        expect(service.activeGames.size).to.be.equal(0);
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
        expect(() => {
            // TODO: fix this
            service.linkedClients.clear();
            service.receivePlayerAction(userId, onlineAction);
        }).to.not.throw(Error);
    });
});
