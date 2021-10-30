/* eslint-disable max-classes-per-file */
import { Action } from '@app/GameLogic/actions/action';
import { OnlineAction } from '@app/GameLogic/actions/online-action-compiler.interface';
import { OnlineActionCompilerService } from '@app/GameLogic/actions/online-action-compiler.service';
import { Board } from '@app/GameLogic/game/board/board';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { GameState } from '@app/GameLogic/game/game-state';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';

interface PlayerWithIndex {
    index: number;
    player: Player;
}

export class OnlineGame {
    players: Player[] = [];
    activePlayerIndex: number = 0;
    lettersRemaining: number = 0;
    isEndOfGame: boolean = false;
    winnerIndex: number[] = [];

    playersWithIndex = new Map<string, PlayerWithIndex>();

    constructor(
        public timePerTurn: number,
        public userName: string,
        private timer: TimerService,
        private onlineSocket: GameSocketHandlerService,
        private boardService: BoardService,
        private onlineActionCompiler: OnlineActionCompilerService,
    ) {
        this.boardService.board = new Board();
        this.userName = userName;
        this.onlineSocket.gameState$.subscribe((gameState: GameState) => {
            this.receiveState(gameState);
        });
    }

    receiveState(gameState: GameState) {
        if (this.playersWithIndex.keys.length === 0) {
            this.setupPlayersWithIndex();
        }
        this.updateClient(gameState);
        this.startTimer();
    }

    handleUserActions() {
        const user = this.players.find((player: Player) => {
            return player.name === this.userName;
        });
        user?.action$.subscribe((action) => {
            const activePlayerName = this.players[this.activePlayerIndex].name;
            if (activePlayerName !== this.userName) {
                return;
            }
            console.log('action action', action);
            this.receivePlayerAction(action);
        });
    }

    private setupPlayersWithIndex() {
        for (let index = 0; index < this.players.length; index++) {
            const player = this.players[index];
            const name = player.name;
            this.playersWithIndex.set(name, { player, index });
        }
    }

    private receivePlayerAction(action: Action) {
        const onlineAction = this.onlineActionCompiler.compileActionOnline(action);
        if (!onlineAction) {
            throw Error('The action received is not supported by the compiler');
        }
        this.sendAction(onlineAction);
    }

    private sendAction(onlineAction: OnlineAction) {
        this.onlineSocket.playAction(onlineAction);
    }

    private startTimer() {
        // TODO: Get gameSettings from game state (Kinda wasteful since you only need it once tho?)
        if (this.timer.isStarted) {
            this.timer.stop();
        }
        this.timer.start(this.timePerTurn);
    }

    private updateClient(gameState: GameState) {
        this.updateBoard(gameState);
        this.updateActivePlayer(gameState);
        this.updatePlayers(gameState);
        this.updateLettersRemaining(gameState);
        this.updateEndOfGame(gameState);
    }

    private updateBoard(gameState: GameState) {
        // TODO: check if buggy if yes create method copy in board
        this.boardService.board.grid = gameState.grid;
    }

    private updateActivePlayer(gameState: GameState) {
        console.log('update active player', gameState);
        console.log(this.playersWithIndex);
        const activePlayerIndex = gameState.activePlayerIndex;
        const activePlayerName = gameState.players[activePlayerIndex].name;
        const playerWithIndex = this.playersWithIndex.get(activePlayerName);
        if (playerWithIndex === undefined) {
            throw Error('Players received with game state are not matching with those of the first turn');
        }
        this.activePlayerIndex = playerWithIndex.index;
    }

    private updateLettersRemaining(gameState: GameState) {
        this.lettersRemaining = gameState.lettersRemaining;
    }

    private updatePlayers(gameState: GameState) {
        for (const lightPlayer of gameState.players) {
            const name = lightPlayer.name;
            const playerWithIndex = this.playersWithIndex.get(name);
            if (!playerWithIndex) {
                throw Error('The players received in game state does not fit with those in the game');
            }
            const player = playerWithIndex.player;
            player.points = lightPlayer.points;

            const newLetterRack = lightPlayer.letterRack;
            for (let letterIndex = 0; letterIndex < newLetterRack.length; letterIndex++) {
                player.letterRack[letterIndex] = newLetterRack[letterIndex];
            }
        }
    }

    private updateEndOfGame(gameState: GameState) {
        this.isEndOfGame = gameState.isEndOfGame;
        this.winnerIndex = gameState.winnerIndex;
    }
}
