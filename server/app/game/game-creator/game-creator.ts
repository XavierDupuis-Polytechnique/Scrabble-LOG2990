import { ServerGame } from '@app/game/game-logic/game/server-game';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { OnlineGameSettings } from '@app/online-game-init/game-settings-multi.interface';
import { GameCompiler } from '@app/services/game-compiler.service';
import { Subject } from 'rxjs';

export class GameCreator {
    static defaultOpponentName = 'AZERTY';

    constructor(
        private pointCalculator: PointCalculatorService,
        private gameCompiler: GameCompiler,
        private messagesService: SystemMessagesService,
        private newGameStateSubject: Subject<GameStateToken>,
        private timerController: TimerController,
    ) {}

    createServerGame(onlineGameSettings: OnlineGameSettings, gameToken: string): ServerGame {
        const newServerGame = new ServerGame(
            this.timerController,
            onlineGameSettings.randomBonus,
            onlineGameSettings.timePerTurn,
            gameToken,
            this.pointCalculator,
            this.gameCompiler,
            this.messagesService,
            this.newGameStateSubject,
        );

        const firstPlayerName = onlineGameSettings.playerName;
        let secondPlayerName = onlineGameSettings.opponentName;
        if (!secondPlayerName) {
            secondPlayerName = GameCreator.defaultOpponentName;
        }
        const players = this.createPlayers(firstPlayerName, secondPlayerName);
        newServerGame.players = players;
        return newServerGame;
    }

    private createPlayers(firstPlayerName: string, secondPlayerName: string): Player[] {
        const playerOne = new Player(firstPlayerName);
        const playerTwo = new Player(secondPlayerName);
        return [playerOne, playerTwo];
    }

    // startGame(): void {
    //     if (!this.game) {
    //         throw Error('No game created yet');
    //     }
    //     this.game.start();
    // }

    // stopGame(): void {
    //     this.timer.stop();
    //     this.game = {} as ServerGame;
    //     this.messageService.clearLog();
    //     this.commandExecuter.resetDebug();
    // }
}
