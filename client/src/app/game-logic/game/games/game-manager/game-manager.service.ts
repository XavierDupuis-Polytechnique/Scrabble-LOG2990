import { Injectable } from '@angular/core';
import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Game } from '@app/game-logic/game/games/game';
import { GameSettings } from '@app/game-logic/game/games/game-settings.interface';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { OfflineGame } from '@app/game-logic/game/games/solo-game/offline-game';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { SpecialOnlineGame } from '@app/game-logic/game/games/special-games/special-online-game';
import { ObjectiveCreator } from '@app/game-logic/game/objectives/objective-creator/objective-creator.service';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { OnlineChatHandlerService } from '@app/game-logic/messages/online-chat-handler/online-chat-handler.service';
import { BotCreatorService } from '@app/game-logic/player/bot/bot-creator.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';
import { OnlineGameSettings } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { UserAuth } from '@app/socket-handler/interfaces/user-auth.interface';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    private game: Game | undefined;
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
        private objectiveCreator: ObjectiveCreator,
        private leaderboardService: LeaderboardService,
    ) {
        this.gameSocketHandler.disconnectedFromServer$.subscribe(() => {
            this.disconnectedFromServerSubject.next();
        });
    }

    createGame(gameSettings: GameSettings): void {
        if (this.game) {
            this.stopGame();
        }
        this.game = new OfflineGame(
            gameSettings.randomBonus,
            gameSettings.timePerTurn,
            this.timer,
            this.pointCalculator,
            this.boardService,
            this.messageService,
        );

        // TODO: remove code repetition
        const playerName = gameSettings.playerName;
        const botDifficulty = gameSettings.botDifficulty;
        const players = this.createPlayers(playerName, botDifficulty);
        this.allocatePlayers(players);
        this.info.receiveGame(this.game);

        this.game.isEndOfGame$.pipe(first()).subscribe(() => {
            if (this.game === undefined) {
                return;
            }
            this.updateLeaderboard(this.game.players, GameMode.Classic);
        });
    }

    createSpecialGame(gameSettings: GameSettings): void {
        this.game = new SpecialOfflineGame(
            gameSettings.randomBonus,
            gameSettings.timePerTurn,
            this.timer,
            this.pointCalculator,
            this.boardService,
            this.messageService,
            this.objectiveCreator,
        );

        // TODO remove code repetition
        const playerName = gameSettings.playerName;
        const botDifficulty = gameSettings.botDifficulty;
        const players = this.createPlayers(playerName, botDifficulty);
        this.allocatePlayers(players);
        this.info.receiveGame(this.game);
        (this.game as SpecialOfflineGame).allocateObjectives();

        this.game.isEndOfGame$.pipe(first()).subscribe(() => {
            if (this.game === undefined) {
                return;
            }
            this.updateLeaderboard(this.game.players, GameMode.Special);
        });
    }

    joinOnlineGame(userAuth: UserAuth, gameSettings: OnlineGameSettings) {
        if (this.game) {
            this.stopGame();
        }

        if (!gameSettings.opponentName) {
            throw Error('No opponent name was entered');
        }

        if (!gameSettings.playerName) {
            throw Error('player name not entered');
        }

        const userName = userAuth.playerName;
        const timerPerTurn = Number(gameSettings.timePerTurn);
        if (gameSettings.gameMode === GameMode.Classic) {
            this.game = new OnlineGame(
                gameSettings.id,
                timerPerTurn,
                userName,
                this.timer,
                this.gameSocketHandler,
                this.boardService,
                this.onlineActionCompiler,
            );
        } else {
            this.game = new SpecialOnlineGame(
                gameSettings.id,
                timerPerTurn,
                userName,
                this.timer,
                this.gameSocketHandler,
                this.boardService,
                this.onlineActionCompiler,
                this.objectiveCreator,
            );
        }

        const onlineGame = this.game as OnlineGame;

        const opponentName = gameSettings.playerName === userName ? gameSettings.opponentName : gameSettings.playerName;
        const players = this.createOnlinePlayers(userName, opponentName);
        this.allocatePlayers(players);
        onlineGame.handleUserActions();

        this.info.receiveGame(this.game);

        this.onlineChat.joinChatRoomWithUser(userAuth.gameToken);
        this.gameSocketHandler.joinGame(userAuth);
    }

    startGame(): void {
        this.messageService.clearLog();
        this.commandExecuter.resetDebug();
        if (!this.game) {
            throw Error('No game created yet');
        }
        this.game.start();
    }

    stopGame(): void {
        this.game?.stop();
        if (this.game instanceof OnlineGame) {
            this.onlineChat.leaveChatRoom();
        }
        this.messageService.clearLog();
        this.commandExecuter.resetDebug();
        this.game = undefined;
    }

    private updateLeaderboard(players: Player[], mode: GameMode) {
        if (players === undefined) {
            return;
        }
        for (const player of players) {
            if (player instanceof User) {
                const score = { mode: GameMode.Classic, name: player.name, point: player.points };
                this.leaderboardService.updateLeaderboard(mode, score);
            }
        }
    }
    private createPlayers(playerName: string, botDifficulty: string): Player[] {
        const user = new User(playerName);
        const bot = this.botService.createBot(playerName, botDifficulty);
        this.info.receiveUser(user);
        return [user, bot];
    }

    private createOnlinePlayers(userName: string, opponentName: string): Player[] {
        const user = new User(userName);
        const opponent = new User(opponentName);
        this.info.receiveUser(user);
        return [user, opponent];
    }

    private allocatePlayers(players: Player[]) {
        if (!this.game) {
            return;
        }
        this.game.players = players;
    }
}
