import { ServerGame } from '@app/game/game-logic/game/server-game';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { OnlineGameSettings } from '@app/online-game-init/game-settings-multi.interface';

export class GameCreator {
    static defaultOpponentName = 'AZERTY';

    constructor(private pointCalculator: PointCalculatorService) {}

    createServerGame(onlineGameSettings: OnlineGameSettings, gameToken: string): ServerGame {
        const newServerGame = new ServerGame(
            onlineGameSettings.randomBonus,
            onlineGameSettings.timePerTurn,
            gameToken,
            this.pointCalculator,
            // this.messageService,
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
