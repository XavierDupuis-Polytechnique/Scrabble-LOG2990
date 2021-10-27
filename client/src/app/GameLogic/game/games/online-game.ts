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

    constructor(
        // public timePerTurn: number,
        public playerName: string,
        private timer: TimerService,
        private onlineSocket: GameSocketHandlerService,
        private boardService: BoardService, // private messagesService: MessagesService, // private clientHandler: ClientHandlerService,
    ) {
        this.boardService.board = new Board();
        this.onlineSocket.gameState$.subscribe((gameState: GameState) => {
            this.receiveState(gameState);
        });
    }

    receiveState(gameState: GameState) {
        // TODO: put in one method update state then start timer
        this.updateBoard(gameState);
        this.updateActivePlayer(gameState);
        this.updatePlayers(gameState);
        this.updateLettersRemaining(gameState);
        this.updateIsEndOfGame(gameState);
        this.timer.start(0);
    }

    updateBoard(gameState: GameState) {
        this.boardService.board.grid = gameState.grid;
    }

    updateActivePlayer(gameState: GameState) {
        // TODO: get time per turn from gamestate
        // this.timer.start(this.gameSetting.timePerTurn);
        this.activePlayerIndex = gameState.activePlayerIndex;
    }

    updateLettersRemaining(gameState: GameState) {
        this.lettersRemaining = gameState.lettersRemaining;
    }

    updatePlayers(gameState: GameState) {
        for (let i = 0; i < 2; i++) {
            this.players[i].points = gameState.players[i].points;
            this.players[i].letterRack = gameState.players[i].letterRack;
        }
    }
    updateIsEndOfGame(gameState: GameState) {
        this.isEndOfGame = gameState.isEndofGame;
    }
}
