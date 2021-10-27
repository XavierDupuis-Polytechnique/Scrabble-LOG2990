import { BoardService } from '@app/game/game-logic/board/board.service';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { Player } from '@app/game/game-logic/player/player';
import { User } from '@app/game/game-logic/player/user';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerService } from '@app/game/game-logic/timer/timer.service';
import { OnlineGameSettings } from '@app/online-game-init/game-settings-multi.interface';

export class GameCreator {
    static defaultOpponentName = 'AZERTY';

    constructor(
        private timer: TimerService,
        private pointCalculator: PointCalculatorService,
        // private messageService: MessagesService,
        private boardService: BoardService,
    ) {}

    createServerGame(onlineGameSettings: OnlineGameSettings): ServerGame {
        const newServerGame = new ServerGame(
            onlineGameSettings.randomBonus,
            onlineGameSettings.timePerTurn,
            this.timer,
            this.pointCalculator,
            this.boardService,
            // this.messageService,
        );

        const firstPlayerName = onlineGameSettings.playerName;
        let secondPlayerName = onlineGameSettings.opponentName;
        if (!secondPlayerName) {
            secondPlayerName = GameCreator.defaultOpponentName;
        }
        const players = this.createPlayers(firstPlayerName, secondPlayerName);
        newServerGame.players = players;
        console.log("Game creator");
        return newServerGame;
    }

    private createPlayers(firstPlayerName: string, secondPlayerName: string): Player[] {
        const playerOne = new User(firstPlayerName);
        const playerTwo = new User(secondPlayerName);
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
