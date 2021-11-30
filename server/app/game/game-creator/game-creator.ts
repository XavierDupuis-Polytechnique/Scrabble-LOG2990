import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { SpecialServerGame } from '@app/game/game-logic/game/special-server-game';
import { EndOfGame } from '@app/game/game-logic/interface/end-of-game.interface';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { ObjectiveCreator } from '@app/game/game-logic/objectives/objective-creator/objective-creator.service';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { GameMode } from '@app/game/game-mode.enum';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { OnlineGameSettings } from '@app/new-game/online-game.interface';
import { Subject } from 'rxjs';

export class GameCreator {
    static defaultOpponentName = 'AZERTY';

    constructor(
        private pointCalculator: PointCalculatorService,
        private gameCompiler: GameCompiler,
        private messagesService: SystemMessagesService,
        private newGameStateSubject: Subject<GameStateToken>,
        private endGameSubject: Subject<EndOfGame>,
        private timerController: TimerController,
        private objectiveCreator: ObjectiveCreator,
    ) {}

    createGame(onlineGameSettings: OnlineGameSettings, gameToken: string): ServerGame {
        const newServerGame = this.createNewGame(onlineGameSettings, gameToken);
        const firstPlayerName = onlineGameSettings.playerName;
        let secondPlayerName = onlineGameSettings.opponentName;
        if (!secondPlayerName) {
            secondPlayerName = GameCreator.defaultOpponentName;
        }
        const players = this.createPlayers(firstPlayerName, secondPlayerName);
        newServerGame.players = players;
        return newServerGame;
    }

    private createNewGame(gameSettings: OnlineGameSettings, gameToken: string) {
        const gameMode = gameSettings.gameMode;
        if (gameMode === GameMode.Special) {
            return this.createSpecialServerGame(gameSettings, gameToken);
        }
        return this.createClassicServerGame(gameSettings, gameToken);
    }

    private createClassicServerGame(gameSettings: OnlineGameSettings, gameToken: string): ServerGame {
        return new ServerGame(
            this.timerController,
            gameSettings.randomBonus,
            gameSettings.timePerTurn,
            gameToken,
            this.pointCalculator,
            this.gameCompiler,
            this.messagesService,
            this.newGameStateSubject,
            this.endGameSubject,
        );
    }

    private createSpecialServerGame(gameSettings: OnlineGameSettings, gameToken: string): ServerGame {
        return new SpecialServerGame(
            this.timerController,
            gameSettings.randomBonus,
            gameSettings.timePerTurn,
            gameToken,
            this.pointCalculator,
            this.gameCompiler,
            this.messagesService,
            this.newGameStateSubject,
            this.endGameSubject,
            this.objectiveCreator,
        );
    }

    private createPlayers(firstPlayerName: string, secondPlayerName: string): Player[] {
        const playerOne = new Player(firstPlayerName);
        const playerTwo = new Player(secondPlayerName);
        return [playerOne, playerTwo];
    }
}
