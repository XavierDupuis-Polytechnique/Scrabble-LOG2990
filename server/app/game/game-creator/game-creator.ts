import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
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
        private endGameSubject: Subject<string>,
        private timerController: TimerController,
    ) {}

    createGame(onlineGameSettings: OnlineGameSettings, gameToken: string): ServerGame {
        const newServerGame = this.createNewGame(onlineGameSettings, gameToken);
        // TODO remove this
        if (!newServerGame) {
            console.log('special game created');
            return this.createClassicServerGame(onlineGameSettings, gameToken);
        }
        // remove this END

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

    // eslint-disable-next-line no-unused-vars
    private createSpecialServerGame(gameSettings: OnlineGameSettings, gameToken: string): void {
        // TODO implement
        // return new SpecialServerGame();
    }

    private createPlayers(firstPlayerName: string, secondPlayerName: string): Player[] {
        const playerOne = new Player(firstPlayerName);
        const playerTwo = new Player(secondPlayerName);
        return [playerOne, playerTwo];
    }
}
