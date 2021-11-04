import { GameActionNotifierService } from '@app/game/game-action-notifier/game-action-notifier.service';
import { GameCreator } from '@app/game/game-creator/game-creator';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { getRandomInt } from '@app/game/game-logic/utils';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { OnlineGameSettings } from '@app/online-game-init/game-settings-multi.interface';
import { GameCompiler } from '@app/services/game-compiler.service';
import { expect } from 'chai';
import { Subject } from 'rxjs';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

describe('GameCreator', () => {
    let gameCreator: GameCreator;
    let onlineGameSettings: OnlineGameSettings;
    let id: string;
    let timePerTurn: number;
    let playerName: string;
    let opponentName: string;
    let randomBonus: boolean;
    let gameToken: string;
    const pointCalculatorStub: SinonStubbedInstance<PointCalculatorService> = createStubInstance(PointCalculatorService);
    const newGameStateSubject = new Subject<GameStateToken>();
    const endGameSubject = new Subject<string>();
    beforeEach(() => {
        id = getRandomInt(Number.MAX_SAFE_INTEGER).toString();
        gameToken = id + 'token';
        timePerTurn = getRandomInt(Number.MAX_SAFE_INTEGER);
        playerName = 'p1';
        opponentName = 'p2';
        randomBonus = getRandomInt(1) === 0;
        gameCreator = new GameCreator(
            pointCalculatorStub,
            new GameCompiler(),
            new SystemMessagesService(new GameActionNotifierService()),
            newGameStateSubject,
            endGameSubject,
            new TimerController(),
        );
    });

    it('should create a server game with requested parameters', () => {
        onlineGameSettings = { id, playerName, opponentName, randomBonus, timePerTurn };
        const createdGame = gameCreator.createServerGame(onlineGameSettings, gameToken);
        expect(createdGame.gameToken).to.be.equal(gameToken);
        expect(createdGame.players).to.be.deep.equal([new Player(playerName), new Player(opponentName)]);
        expect(createdGame.timePerTurn).to.be.equal(timePerTurn);
        expect(createdGame.randomBonus).to.be.equal(randomBonus);
    });

    it('should create a server game with requested parameters and default opponent name', () => {
        onlineGameSettings = { id, playerName, randomBonus, timePerTurn };
        const createdGame = gameCreator.createServerGame(onlineGameSettings, gameToken);
        expect(createdGame.gameToken).to.be.equal(gameToken);
        expect(createdGame.players).to.be.deep.equal([new Player(playerName), new Player(GameCreator.defaultOpponentName)]);
        expect(createdGame.timePerTurn).to.be.equal(timePerTurn);
        expect(createdGame.randomBonus).to.be.equal(randomBonus);
    });
});
