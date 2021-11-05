import { Injectable } from '@angular/core';
import { OnlineActionCompilerService } from '@app/GameLogic/actions/online-actions/online-action-compiler.service';
import { CommandExecuterService } from '@app/GameLogic/commands/command-executer/command-executer.service';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { GameSettings } from '@app/GameLogic/game/games/game-settings.interface';
import { OnlineGame } from '@app/GameLogic/game/games/online-game/online-game';
import { Game } from '@app/GameLogic/game/games/solo-game/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { OnlineChatHandlerService } from '@app/GameLogic/messages/online-chat-handler/online-chat-handler.service';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { OnlineGameSettings } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { UserAuth } from '@app/socket-handler/interfaces/user-auth.interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    private game: Game | undefined;
    private onlineGame: OnlineGame | undefined;
    private newGameSubject = new Subject<void>();
    get newGame$(): Observable<void> {
        return this.newGameSubject;
    }

    private disconnectedFromServerSubject = new Subject<void>();
    get disconnectedFromServer$(): Observable<void> {
        return this.disconnectedFromServerSubject;
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
        private onlineChat: OnlineChatHandlerService,
        private onlineActionCompiler: OnlineActionCompilerService,
    ) {
        this.gameSocketHandler.disconnectedFromServer$.subscribe(() => {
            this.disconnectedFromServerSubject.next();
        });
    }

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

    joinOnlineGame(userAuth: UserAuth, gameSettings: OnlineGameSettings) {
        if (this.game || this.onlineGame) {
            this.stopGame();
        }
        if (!gameSettings.opponentName) {
            throw Error('No opponent name was entered');
        }
        const userName = userAuth.playerName;
        const timerPerTurn = Number(gameSettings.timePerTurn);
        this.onlineGame = new OnlineGame(
            gameSettings.id,
            timerPerTurn,
            userName,
            this.timer,
            this.gameSocketHandler,
            this.boardService,
            this.onlineActionCompiler,
        );

        const opponentName = gameSettings.playerName === userName ? gameSettings.opponentName : gameSettings.playerName;
        const players = this.createOnlinePlayers(userName, opponentName);
        this.allocateOnlinePlayers(players);
        this.onlineGame.handleUserActions();

        this.info.receiveOnlineGame(this.onlineGame);

        this.onlineChat.joinChatRoomWithUser(userAuth.gameToken);
        this.gameSocketHandler.joinGame(userAuth);
    }

    startGame(): void {
        this.messageService.clearLog();
        this.commandExecuter.resetDebug();
        if (!this.game && !this.onlineGame) {
            throw Error('No game created yet');
        }

        if (this.game) {
            this.game.start();
        }
    }

    stopGame(): void {
        if (this.game) {
            this.stopSoloGame();
        }

        if (this.onlineGame) {
            this.stopOnlineGame();
        }

        this.messageService.clearLog();
        this.commandExecuter.resetDebug();
    }

    private stopSoloGame() {
        this.timer.stop();
        this.game = undefined;
    }

    private stopOnlineGame() {
        this.timer.stop();
        this.onlineGame?.forfeit();
        this.onlineGame?.close();
        this.onlineGame = undefined;
        this.onlineChat.leaveChatRoom();
    }

    private createPlayers(playerName: string, botDifficulty: string): Player[] {
        const user = new User(playerName);
        const bot = this.botService.createBot(playerName, botDifficulty);
        this.info.receiveUser(user);
        return [user, bot];
    }

    private allocatePlayers(players: Player[]) {
        (this.game as Game).players = players;
    }

    private createOnlinePlayers(userName: string, opponentName: string): Player[] {
        const user = new User(userName);
        const opponent = new User(opponentName);
        this.info.receiveUser(user);
        return [user, opponent];
    }

    private allocateOnlinePlayers(players: Player[]) {
        (this.onlineGame as OnlineGame).players = players;
    }
}
