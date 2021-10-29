/* eslint-disable max-classes-per-file */
import { Board } from '@app/GameLogic/game/board/board';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { GameState } from '@app/GameLogic/game/game-state';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';

export class OnlineGame {
    players: Player[] = [];
    activePlayerIndex: number = 0;
    lettersRemaining: number = 0;
    isEndOfGame: boolean = false;
    winnerIndex: number[] = [];

    constructor(
        public timePerTurn: number,
        public playerName: string,
        private timer: TimerService,
        private onlineSocket: GameSocketHandlerService,
        private boardService: BoardService,
    ) {
        this.boardService.board = new Board();
        this.playerName = playerName;
        this.onlineSocket.gameState$.subscribe((gameState: GameState) => {
            this.receiveState(gameState);
        });
    }

    receiveState(gameState: GameState) {
        this.updateClient(gameState);
        this.startTimer();
    }

    private startTimer() {
        // TODO: Get gameSettings from game state (Kinda wasteful since you only need it once tho?)
        // this.timer.start(this.gameSetting.timePerTurn);
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
        this.activePlayerIndex = gameState.activePlayerIndex;
    }

    private updateLettersRemaining(gameState: GameState) {
        this.lettersRemaining = gameState.lettersRemaining;
    }

    private updatePlayers(gameState: GameState) {
        console.log('update players');
        // TODO: take into consideration the player orders on client
        for (let i = 0; i < 2; i++) {
            this.players[i].points = gameState.players[i].points;
            const newLetterRack = gameState.players[i].letterRack;
            for (let j = 0; j < newLetterRack.length; j++) {
                this.players[i].letterRack[j] = newLetterRack[j];
            }
        }
    }

    private updateEndOfGame(gameState: GameState) {
        this.isEndOfGame = gameState.isEndOfGame;
        this.winnerIndex = gameState.winnerIndex;
    }
}
