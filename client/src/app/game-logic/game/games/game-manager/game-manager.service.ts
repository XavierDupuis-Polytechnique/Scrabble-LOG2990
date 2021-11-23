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
    private transition = new Subject<void>();

    get transition$(): Observable<void> {
        return this.transition;
    }
    private newGameSubject = new Subject<void>();

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
            this.instanciateGameFromForfeitedState(forfeitedGameState);
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

    instanciateGameFromForfeitedState(forfeitedGameState: ForfeitedGameSate) {
        let userName = 'Qwerty';
        let publicObjective;
        let privateObjective;
        if (!this.game) {
            return;
        }
        let wasSpecial = false;
        if (this.game instanceof SpecialOnlineGame) {
            wasSpecial = true;
            userName = this.game.userName;
            publicObjective = this.game.publicObjectives;
            privateObjective = this.game.privateObjectives;
        } else if (this.game instanceof OnlineGame) {
            userName = this.game.userName;
        }

        const offlineGame = this.instanciateGameSettings(forfeitedGameState, wasSpecial);
        const oldBoard = this.boardService.board;

        this.stopGame();

        offlineGame.board = oldBoard;
        // const letterRackRef = this.info.user.letterRack;
        this.game = offlineGame;

        const playerName = userName;
        const botDifficulty = 'Easy';
        const players = this.createPlayers(playerName, botDifficulty);

        this.allocatePlayers(players);
        if (offlineGame instanceof SpecialOfflineGame) {
            offlineGame.allocateObjectives();
        }
        this.transitionBoard(forfeitedGameState);
        offlineGame.letterBag.gameLetters = forfeitedGameState.letterBag;
        offlineGame.consecutivePass = forfeitedGameState.consecutivePass;
        const playerInfo = forfeitedGameState.players;
        const userIndex = playerInfo.findIndex((player) => {
            return player.name === playerName;
        });
        const botIndex = (userIndex + 1) % 2;
        offlineGame.players[userIndex].points = playerInfo[userIndex].points;
        offlineGame.players[botIndex].points = playerInfo[botIndex].points;
        const botName = offlineGame.players[botIndex].name;
        if (offlineGame instanceof SpecialOfflineGame) {
            const playerPrivateObjective = privateObjective?.get(userName);
            const botPrivateObjective = privateObjective?.get(playerInfo[botIndex].name);
            if (publicObjective !== undefined && playerPrivateObjective !== undefined && botPrivateObjective !== undefined) {
                offlineGame.privateObjectives.set(userName, playerPrivateObjective);
                offlineGame.privateObjectives.set(botName, botPrivateObjective);
                offlineGame.publicObjectives = publicObjective;
            }
        }

        // TODO fix this
        for (let i = 0; i < players.length; i++) {
            offlineGame.players[i].points = playerInfo[i].points;
            for (let j = 0; j < playerInfo[i].letterRack.length; j++) {
                offlineGame.players[i].letterRack[j] = playerInfo[i].letterRack[j];
            }
        }

        this.info.receiveGame(offlineGame);
        this.transition.next();
        this.startGame();
    }

    transitionBoard(forfeitedGameState: ForfeitedGameSate) {
        const nRows = BOARD_DIMENSION;
        const nCols = BOARD_DIMENSION;
        const newGrid = forfeitedGameState.grid;

        for (let i = 0; i < nRows; i++) {
            for (let j = 0; j < nCols; j++) {
                this.boardService.board.grid[i][j] = newGrid[i][j];
            }
        }
    }

    copyGameInformation() {
        if (this.game instanceof SpecialOnlineGame) {
            return [
                this.game.timePerTurn,
                this.game.userName,
                this.game.activePlayerIndex,
                this.game.privateObjectives,
                this.game.publicObjectives,
                this.game.players,
            ];
        }
        if (this.game instanceof OnlineGame) {
            return [this.game.timePerTurn, this.game.userName, this.game.activePlayerIndex, this.game.players];
        }
        return;
    }

    // TODO: change les noms des mthodes
    instanciateGameSettings(f: ForfeitedGameSate, isSpecial: boolean): SpecialOfflineGame | OfflineGame {
        const timerPerTurn = (this.game as OnlineGame).timePerTurn;
        if (isSpecial) {
            this.game = new SpecialOfflineGame(
                f.randomBonus,
                timerPerTurn,
                this.timer,
                this.pointCalculator,
                this.boardService,
                this.messageService,
                this.objectiveCreator,
                true,
            );
            return this.game as SpecialOfflineGame;
        }
        this.game = new OfflineGame(f.randomBonus, timerPerTurn, this.timer, this.pointCalculator, this.boardService, this.messageService, true);
        return this.game as OfflineGame;
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
