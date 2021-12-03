import { Injectable } from '@angular/core';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { BOARD_DIMENSION } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Game } from '@app/game-logic/game/games/game';
import { OfflineGameCreationParams, OnlineGameCreationParams } from '@app/game-logic/game/games/game-creator/game-creation-params';
import { GameCreatorService } from '@app/game-logic/game/games/game-creator/game-creator.service';
import { GameSettings } from '@app/game-logic/game/games/game-settings.interface';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { ForfeitedGameState } from '@app/game-logic/game/games/online-game/game-state';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { SpecialOnlineGame } from '@app/game-logic/game/games/special-games/special-online-game';
import { ObjectiveLoader } from '@app/game-logic/game/objectives/objective-loader/objective-loader';
import { PlayerNames } from '@app/game-logic/game/objectives/objective-loader/players-names.interface';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { OnlineChatHandlerService } from '@app/game-logic/messages/online-chat-handler/online-chat-handler.service';
import { BotCreatorService } from '@app/game-logic/player/bot/bot-creator.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';
import { OnlineGameSettings } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { UserAuth } from '@app/socket-handler/interfaces/user-auth.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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

    get forfeitGameState$(): Observable<ForfeitedGameState> {
        return this.gameSocketHandler.forfeitGameState$;
    }

    constructor(
        private botService: BotCreatorService,
        private messageService: MessagesService,
        private info: GameInfoService,
        private commandExecuter: CommandExecuterService,
        private gameSocketHandler: GameSocketHandlerService,
        private onlineChat: OnlineChatHandlerService,
        private leaderboardService: LeaderboardService,
        private dictionaryService: DictionaryService,
        private gameCreator: GameCreatorService,
        private boardService: BoardService,
        private objectiveLoader: ObjectiveLoader,
    ) {
        this.gameSocketHandler.disconnectedFromServer$.subscribe(() => {
            this.disconnectedFromServerSubject.next();
        });
    }

    createGame(gameSettings: GameSettings): BehaviorSubject<boolean> {
        if (this.game && this.game instanceof OfflineGame) {
            this.stopGame();
        }

        const dictReady$ = this.dictionaryService.fetchDictionary(gameSettings.dictTitle);

        const newGame = this.gameCreator.createOfflineGame(gameSettings);
        this.game = newGame;

        this.setupOfflineGame(gameSettings);
        this.info.receiveGame(newGame);
        this.updateLeaboardWhenGameEnds(newGame, GameMode.Classic);
        return dictReady$;
    }

    createSpecialGame(gameSettings: GameSettings): BehaviorSubject<boolean> {
        const newGame = this.gameCreator.createSpecialOfflineGame(gameSettings);
        this.game = newGame;

        const dictReady$ = this.dictionaryService.fetchDictionary(gameSettings.dictTitle);

        this.setupOfflineGame(gameSettings);
        this.info.receiveGame(this.game);
        newGame.allocateObjectives();

        this.updateLeaboardWhenGameEnds(this.game, GameMode.Special);

        return dictReady$;
    }

    instanciateGameFromForfeitedState(forfeitedGameState: ForfeitedGameState) {
        if (!this.game) {
            return;
        }
        const userName = (this.game as OnlineGame).userName;
        const wasSpecial = this.game instanceof SpecialOnlineGame;

        this.createConvertedGame(forfeitedGameState, wasSpecial);
        const players = this.createOfflinePlayers(userName, 'easy');
        this.allocatePlayers(players);

        if (!(this.game instanceof OfflineGame)) {
            throw Error('The type of game is not offlineGame after converting the online game to offline');
        }
        this.loadBoard(forfeitedGameState);
        this.game.letterBag.gameLetters = forfeitedGameState.letterBag;
        this.game.consecutivePass = forfeitedGameState.consecutivePass;
        const playerInfo = forfeitedGameState.players;

        const userIndex = playerInfo.findIndex((player) => {
            return player.name === userName;
        });

        const botIndex = (userIndex + 1) % 2;
        const botName = this.game.players[botIndex].name;
        this.loadPlayerInfo(userIndex, botIndex, forfeitedGameState);

        this.info.receiveGame(this.game);

        if (this.game instanceof SpecialOfflineGame && forfeitedGameState.objectives) {
            const playerNames: PlayerNames = {
                userName,
                botName,
            };
            this.objectiveLoader.loadObjectivesIntoGame(this.game, forfeitedGameState.objectives, playerNames);
        }
    }

    joinOnlineGame(userAuth: UserAuth, gameSettings: OnlineGameSettings) {
        if (this.game) {
            this.stopGame();
        }

        if (!gameSettings.opponentName) {
            throw Error('No opponent name was entered');
        }

        const username = userAuth.playerName;
        const timePerTurn = Number(gameSettings.timePerTurn);
        const gameCreationParams: OnlineGameCreationParams = { id: gameSettings.id, timePerTurn, username };

        this.game = this.createOnlineGame(gameCreationParams, gameSettings.gameMode);

        const onlineGame = this.game as OnlineGame;
        const opponentName = gameSettings.playerName === username ? gameSettings.opponentName : gameSettings.playerName;
        const players = this.createOnlinePlayers(username, opponentName);
        this.allocatePlayers(players);
        onlineGame.handleUserActions();
        this.info.receiveGame(this.game);
        this.onlineChat.joinChatRoomWithUser(userAuth.gameToken);
        this.gameSocketHandler.joinGame(userAuth);
    }

    startGame(): void {
        this.resetServices();
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
        this.resetServices();
        this.game = undefined;
    }

    startConvertedGame(forfeitedGameState: ForfeitedGameState) {
        if (!this.game) {
            return;
        }
        const activePlayerIndex = forfeitedGameState.activePlayerIndex;
        this.resumeGame(activePlayerIndex);
        const gameMode = this.game instanceof SpecialOfflineGame ? GameMode.Special : GameMode.Classic;
        this.updateLeaboardWhenGameEnds(this.game, gameMode);
    }

    private resumeGame(activePlayerIndex: number) {
        this.resetServices();
        if (!this.game) {
            throw Error('No game created yet');
        }
        (this.game as OfflineGame).resume(activePlayerIndex);
    }

    private createConvertedGame(forfeitedGameState: ForfeitedGameState, isSpecial: boolean) {
        const timePerTurn = (this.game as OnlineGame).timePerTurn;
        this.stopGame();
        const gameCreationParams: OfflineGameCreationParams = { timePerTurn, randomBonus: forfeitedGameState.randomBonus };
        this.game = this.createLoadedGame(gameCreationParams, isSpecial);
    }

    private loadBoard(forfeitedGameState: ForfeitedGameState) {
        (this.game as OfflineGame).board = this.boardService.board;
        const nRows = BOARD_DIMENSION;
        const nCols = BOARD_DIMENSION;
        const newGrid = forfeitedGameState.grid;

        for (let i = 0; i < nRows; i++) {
            for (let j = 0; j < nCols; j++) {
                this.boardService.board.grid[i][j] = newGrid[i][j];
            }
        }
    }

    private loadPlayerInfo(userIndex: number, botIndex: number, forfeitedGameState: ForfeitedGameState) {
        if (this.game instanceof SpecialOfflineGame || this.game instanceof OfflineGame) {
            const playerInfo = forfeitedGameState.players;

            for (let i = 0; i < playerInfo.length; i++) {
                for (let j = 0; j < playerInfo[i].letterRack.length; j++) {
                    this.game.players[i].letterRack[j] = playerInfo[i].letterRack[j];
                }
            }
            this.game.players[0].points = playerInfo[userIndex].points;
            this.game.players[1].points = playerInfo[botIndex].points;
        }
    }

    private updateLeaboardWhenGameEnds(game: Game, gameMode: GameMode) {
        game.isEndOfGame$.pipe(first()).subscribe(() => {
            if (!this.game) {
                return;
            }
            this.updateLeaderboard(this.game.players, gameMode);
        });
    }

    private setupOfflineGame(gameSettings: GameSettings) {
        const playerName = gameSettings.playerName;
        const botDifficulty = gameSettings.botDifficulty;
        const players = this.createOfflinePlayers(playerName, botDifficulty);
        this.allocatePlayers(players);
    }

    private resetServices() {
        this.messageService.clearLog();
        this.commandExecuter.resetDebug();
    }

    private updateLeaderboard(players: Player[], mode: GameMode) {
        if (!players) {
            return;
        }
        players.forEach((player) => {
            if (player instanceof User) {
                const score = { mode, name: player.name, point: player.points };
                this.leaderboardService.updateLeaderboard(mode, score);
            }
        });
    }

    private createOfflinePlayers(playerName: string, botDifficulty: string): Player[] {
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

    private createOnlineGame(gameCreationParams: OnlineGameCreationParams, mode: GameMode) {
        if (mode === GameMode.Classic) {
            return this.gameCreator.createOnlineGame(gameCreationParams);
        }
        return this.gameCreator.createSpecialOnlineGame(gameCreationParams);
    }

    private createLoadedGame(gameCreationParams: OfflineGameCreationParams, isSpecial: boolean) {
        const isLoaded = true;
        if (isSpecial) {
            return this.gameCreator.createSpecialOfflineGame(gameCreationParams, isLoaded);
        }
        return this.gameCreator.createOfflineGame(gameCreationParams, isLoaded);
    }
}
