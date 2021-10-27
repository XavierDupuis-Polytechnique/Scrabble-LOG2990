import { Injectable } from '@angular/core';
import { CommandExecuterService } from '@app/GameLogic/commands/commandExecuter/command-executer.service';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { OnlineGame } from '@app/GameLogic/game/games/online-game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { UserAuth } from '@app/modeMulti/interface/user-auth.interface';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { Observable, Subject } from 'rxjs';
import { Game } from './game';
import { GameSettings } from './game-settings.interface';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    private game: Game;
    private onlineGame: OnlineGame;
    private newGameSubject = new Subject<void>();
    get newGame$(): Observable<void> {
        return this.newGameSubject;
    }

    constructor(
        private botService: BotCreatorService,
        private timer: TimerService,
        private pointCalculator: PointCalculatorService,
        private info: GameInfoService,
        private messageService: MessagesService,
        private boardService: BoardService,
        private commandExecuter: CommandExecuterService,
        private gameSocketHandler: GameSocketHandlerService,
    ) {}

    createGame(gameSettings: GameSettings): void {
        if (this.game) {
            this.stopGame();
        }
        this.game = new Game(
            gameSettings.randomBonus,
            gameSettings.timePerTurn,
            this.timer,
            this.pointCalculator,
            this.boardService,
            this.messageService,
        );

        const playerName = gameSettings.playerName;
        const botDifficulty = gameSettings.botDifficulty;
        const players = this.createPlayers(playerName, botDifficulty);
        this.allocatePlayers(players);
        this.info.receiveGame(this.game);
    }

    joinOnlineGame(userAuth: UserAuth) {
        if (this.game) {
            this.stopGame();
        }
        console.log('joinOnline game', userAuth);
        this.gameSocketHandler.joinGame(userAuth);
        const playerName = userAuth.playerName;
        // TODO: maybe find a way to receive timer time perturn
        this.onlineGame = new OnlineGame(playerName, this.timer, this.gameSocketHandler, this.boardService);
        this.info.receiveOnlineGame(this.onlineGame);
    }

    startGame(): void {
        if (!this.game && !this.onlineGame) {
            throw Error('No game created yet');
        }
        if (!this.onlineGame) {
            this.game.start();
        }
    }

    stopGame(): void {
        this.timer.stop();
        this.game = {} as Game;
        this.messageService.clearLog();
        this.commandExecuter.resetDebug();
    }

    private createPlayers(playerName: string, botDifficulty: string): Player[] {
        const user = new User(playerName);
        const bot = this.botService.createBot(playerName, botDifficulty);
        this.info.receiveUser(user);
        return [user, bot];
    }

    private allocatePlayers(players: Player[]) {
        this.game.players = players;
    }
}
