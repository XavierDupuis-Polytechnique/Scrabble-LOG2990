import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { GameCreator } from '@app/game/game-creator/game-creator';
import { DEFAULT_DICTIONARY_TITLE } from '@app/game/game-logic/constants';
import { SpecialServerGame } from '@app/game/game-logic/game/special-server-game';
import { EndOfGame } from '@app/game/game-logic/interface/end-of-game.interface';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { ObjectiveCreator } from '@app/game/game-logic/objectives/objective-creator/objective-creator.service';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { getRandomInt } from '@app/game/game-logic/utils';
import { GameMode } from '@app/game/game-mode.enum';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { OnlineGameSettings } from '@app/new-game/online-game.interface';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';
import { Subject } from 'rxjs';

describe('GameCreator', () => {
    let gameCreator: GameCreator;
    let onlineGameSettings: OnlineGameSettings;
    let id: string;
    let timePerTurn: number;
    let playerName: string;
    let opponentName: string;
    let randomBonus: boolean;
    let gameMode: GameMode;
    let gameToken: string;
    let dictTitle: string;
    const pointCalculatorStub = createSinonStubInstance<PointCalculatorService>(PointCalculatorService);
    const gameCompilerStub = createSinonStubInstance<GameCompiler>(GameCompiler);
    const systemMessagesServiceStub = createSinonStubInstance<SystemMessagesService>(SystemMessagesService);
    const timerControllerStub = createSinonStubInstance<TimerController>(TimerController);
    const objectiveCreatorStub = createSinonStubInstance<ObjectiveCreator>(ObjectiveCreator);

    const newGameStateSubject = new Subject<GameStateToken>();
    const endGameSubject = new Subject<EndOfGame>();
    beforeEach(() => {
        id = getRandomInt(Number.MAX_SAFE_INTEGER).toString();
        gameToken = id + 'token';
        timePerTurn = getRandomInt(Number.MAX_SAFE_INTEGER);
        playerName = 'p1';
        opponentName = 'p2';
        randomBonus = getRandomInt(1) === 0;
        dictTitle = DEFAULT_DICTIONARY_TITLE;
        gameMode = GameMode.Classic;
        gameCreator = new GameCreator(
            pointCalculatorStub,
            gameCompilerStub,
            systemMessagesServiceStub,
            newGameStateSubject,
            endGameSubject,
            timerControllerStub,
            objectiveCreatorStub,
        );
    });

    it('should create a server game with requested parameters', () => {
        onlineGameSettings = { id, playerName, opponentName, randomBonus, timePerTurn, gameMode, dictTitle };
        const createdGame = gameCreator.createGame(onlineGameSettings, gameToken);
        expect(createdGame.gameToken).to.be.equal(gameToken);
        expect(createdGame.players).to.be.deep.equal([new Player(playerName), new Player(opponentName)]);
        expect(createdGame.timePerTurn).to.be.equal(timePerTurn);
        expect(createdGame.randomBonus).to.be.equal(randomBonus);
    });

    it('should create a server game with requested parameters and default opponent name', () => {
        onlineGameSettings = { id, playerName, randomBonus, timePerTurn, gameMode, dictTitle };
        const createdGame = gameCreator.createGame(onlineGameSettings, gameToken);
        expect(createdGame.gameToken).to.be.equal(gameToken);
        expect(createdGame.players).to.be.deep.equal([new Player(playerName), new Player(GameCreator.defaultOpponentName)]);
        expect(createdGame.timePerTurn).to.be.equal(timePerTurn);
        expect(createdGame.randomBonus).to.be.equal(randomBonus);
    });

    it('should create a special server game with requested parameters and default opponent name', () => {
        gameMode = GameMode.Special;
        onlineGameSettings = { id, playerName, randomBonus, timePerTurn, gameMode, dictTitle };
        const createdGame = gameCreator.createGame(onlineGameSettings, gameToken);
        expect(createdGame.gameToken).to.be.equal(gameToken);
        expect(createdGame.players).to.be.deep.equal([new Player(playerName), new Player(GameCreator.defaultOpponentName)]);
        expect(createdGame.timePerTurn).to.be.equal(timePerTurn);
        expect(createdGame.randomBonus).to.be.equal(randomBonus);
        expect(createdGame as SpecialServerGame).instanceof(SpecialServerGame);
    });
});
