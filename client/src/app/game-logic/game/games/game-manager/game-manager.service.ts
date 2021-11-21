import { Injectable } from '@angular/core';
import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { BOARD_DIMENSION } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Game } from '@app/game-logic/game/games/game';
import { GameSettings } from '@app/game-logic/game/games/game-settings.interface';
import { ForfeitedGameSate } from '@app/game-logic/game/games/online-game/game-state';
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
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';
import { OnlineGameSettings } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { UserAuth } from '@app/socket-handler/interfaces/user-auth.interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    private game: Game | undefined;
    private newGameSubject = new Subject<void>();
    private transition = new Subject<void>();
    get transition$(): Observable<void> {
        return this.transition;
    }
    get newGame$(): Observable<void> {
        return this.newGameSubject;
    }
    private disconnectedFromServerSubject = new Subject<void>();
    get disconnectedFromServer$(): Observable<void> {
        return this.disconnectedFromServerSubject;
    }
    get disconnectedState$(): Observable<ForfeitedGameSate> {
        return this.gameSocketHandler.forfeitGameState$;
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
    ) {
        this.gameSocketHandler.disconnectedFromServer$.subscribe(() => {
            this.disconnectedFromServerSubject.next();
        });

        this.disconnectedState$.subscribe((forfeitedGameState: ForfeitedGameSate) => {
            this.toOfflineGame(forfeitedGameState);
        });
    }

    createGame(gameSettings: GameSettings): void {
        if (this.game && this.game instanceof OfflineGame) {
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
    }

    createLoadedGame(forfeitedGameState: ForfeitedGameSate) {
        if (!this.game) {
            return;
        }

        if (this.game && this.game instanceof OfflineGame) {
            this.stopGame();
        }
        const timePerTurn = (this.game as OnlineGame).timePerTurn;
        const userName = (this.game as OnlineGame).userName;
        this.game = new OfflineGame(
            forfeitedGameState.randomBonus,
            timePerTurn,
            this.timer,
            this.pointCalculator,
            this.boardService,
            this.messageService,
            true,
        );
        const offlineGame = this.game as OfflineGame;
        const oldBoard = this.boardService.board;
        offlineGame.board = oldBoard;
        // const letterRackRef = this.info.user.letterRack;
        this.game = offlineGame;

        console.log(forfeitedGameState.players);
        const playerName = userName;
        const botDifficulty = 'Easy';
        const players = this.createPlayers(playerName, botDifficulty);
        console.log(players);
        this.allocatePlayers(players);

        const nRows = BOARD_DIMENSION;
        const nCols = BOARD_DIMENSION;
        const newGrid = forfeitedGameState.grid;

        for (let i = 0; i < nRows; i++) {
            for (let j = 0; j < nCols; j++) {
                this.boardService.board.grid[i][j] = newGrid[i][j];
            }
        }

        offlineGame.letterBag.gameLetters = forfeitedGameState.letterBag;
        offlineGame.consecutivePass = forfeitedGameState.consecutivePass;
        const playerInfo = forfeitedGameState.players;
        console.log(playerInfo);
        // TODO fix this
        for (let i = 0; i < 0; i++) {
            offlineGame.players[i].points = playerInfo[i].points;
            for (let j = 0; j < playerInfo[i].letterRack.length; j++) {
                offlineGame.players[i].letterRack[j] = playerInfo[i].letterRack[j];
            }
        }
        console.log(players);
        this.info.receiveGame(offlineGame);
        this.transition.next();
        this.startGame();
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
        console.log(userAuth, gameSettings);
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

        if (this.game) {
            this.game.start();
        }
    }

    toOfflineGame(forfeitedGameState: ForfeitedGameSate) {
        this.createLoadedGame(forfeitedGameState);
        // if (!(this.game instanceof OnlineGame)) {
        //     return;
        // }
        // const playerInfo = forfeitedGameState.players;
        // const playerName = this.game.userName;

        // const newGameSettings: GameSettings = {
        //     playerName,
        //     botDifficulty: 'EasyBot',
        //     timePerTurn: this.game.timePerTurn,
        //     randomBonus: forfeitedGameState.randomBonus,
        // };
        // this.createGame(newGameSettings);

        // if (!(this.game instanceof OfflineGame)) {
        //     return;
        // }
        // const offlineGame = this.game as OfflineGame;
        // const nRows = BOARD_DIMENSION;
        // const nCols = BOARD_DIMENSION;
        // const newGrid = forfeitedGameState.grid;
        // for (let i = 0; i < nRows; i++) {
        //     for (let j = 0; j < nCols; j++) {
        //         this.boardService.board.grid[i][j] = newGrid[i][j];
        //     }
        // }
        // // offlineGame.board.grid = forfeitedGameState.grid;
        // offlineGame.letterBag.gameLetters = forfeitedGameState.letterBag;
        // offlineGame.consecutivePass = forfeitedGameState.consecutivePass;
        // for (let i = 0; i < 0; i++) {
        //     offlineGame.players[i].points = playerInfo[i].points;
        //     offlineGame.players[i].letterRack = playerInfo[i].letterRack;
        // }
        // this.startGame();
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
