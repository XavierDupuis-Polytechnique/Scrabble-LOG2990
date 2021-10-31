/* eslint-disable max-classes-per-file */
import { Action } from '@app/GameLogic/actions/action';
import { OnlineAction } from '@app/GameLogic/actions/online-action-compiler.interface';
import { OnlineActionCompilerService } from '@app/GameLogic/actions/online-action-compiler.service';
import { RACK_LETTER_COUNT } from '@app/GameLogic/constants';
import { Board } from '@app/GameLogic/game/board/board';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { GameState } from '@app/GameLogic/game/game-state';
import { TimerControls } from '@app/GameLogic/game/timer/timer-controls.enum';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { Subscription } from 'rxjs';

interface PlayerWithIndex {
    index: number;
    player: Player;
}

export class OnlineGame {
    players: Player[] = [];
    activePlayerIndex: number = 0;
    lettersRemaining: number = 0;
    isEndOfGame: boolean = false;
    winnerNames: string[];
    playersWithIndex = new Map<string, PlayerWithIndex>();

    private gameState$$ : Subscription;
    private timerControls$$ : Subscription;

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
        this.gameState$$ = this.onlineSocket.gameState$.subscribe((gameState: GameState) => {
            this.receiveState(gameState);
        });

        this.timerControls$$ = this.onlineSocket.timerControls$.subscribe((timerControl: TimerControls) => {
            this.receiveTimerControl(timerControl);
        });
    }

    close() {
        this.gameState$$.unsubscribe();
        this.timerControls$$?.unsubscribe();
    }

    receiveState(gameState: GameState) {
        if (this.playersWithIndex.size === 0) {
            this.setupPlayersWithIndex();
        }
        this.updateClient(gameState);
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
            this.receivePlayerAction(action);
        });
    }

    forfeit() {
        this.onlineSocket.forfeit();
    }

    getWinner() {
        const winners = this.winnerNames.map((name) => {
            const playerWithIndex = this.playersWithIndex.get(name);
            if (!playerWithIndex) {
                throw Error('Winner names does not fit with the player names');
            }
            return playerWithIndex.player;
        });
        return winners;
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

    private receiveTimerControl(timerControl: TimerControls) {
        if (timerControl === TimerControls.Start) {
            this.timer.start(this.timePerTurn);
        }

        if (timerControl === TimerControls.Stop) {
            this.timer.stop();
        }
    }

    private updateClient(gameState: GameState) {
        this.updateBoard(gameState);
        this.updateActivePlayer(gameState);
        this.updatePlayers(gameState);
        this.updateLettersRemaining(gameState);
        this.updateEndOfGame(gameState);
    }

    private updateBoard(gameState: GameState) {
        this.boardService.board.grid = gameState.grid;
    }

    private updateActivePlayer(gameState: GameState) {
        const activePlayerIndex = gameState.activePlayerIndex;
        const activePlayerName = gameState.players[activePlayerIndex].name;
        const playerWithIndex = this.playersWithIndex.get(activePlayerName);
        if (playerWithIndex === undefined) {
            console.log('CRASH', this.playersWithIndex, gameState);
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
            if (this.isLetterRackChanged(newLetterRack, player)) {
                for (let letterIndex = 0; letterIndex < newLetterRack.length; letterIndex++) {
                    player.letterRack[letterIndex] = newLetterRack[letterIndex];
                }
            }
        }
    }

    private isLetterRackChanged(newLetterRack: Letter[], player: Player): boolean {
        const mapRack = this.makeLetterRackMap(newLetterRack);
        let isChanged = false;
        if (player.letterRack.length < RACK_LETTER_COUNT) {
            isChanged = true;
            return isChanged;
        }

        for (const letter of player.letterRack) {
            const letterCount = mapRack.get(letter.char);
            if (letterCount === undefined) {
                isChanged = true;
            } else if (letterCount >= 1) {
                mapRack.set(letter.char, letterCount - 1);
            } else if (letterCount === 0) {
                isChanged = true;
            }
        }
        return isChanged;
    }

    private makeLetterRackMap(letterRack: Letter[]): Map<string, number> {
        const mapRack = new Map<string, number>();
        for (const letter of letterRack) {
            const letterCount = mapRack.get(letter.char);
            if (letterCount !== undefined) {
                mapRack.set(letter.char, letterCount + 1);
            } else {
                mapRack.set(letter.char, 1);
            }
        }
        return mapRack;
    }

    private updateEndOfGame(gameState: GameState) {
        this.isEndOfGame = gameState.isEndOfGame;
        this.winnerNames = gameState.winnerIndex.map((index: number) => {
            return gameState.players[index].name;
        });
        // this.winnerIndex = gameState.winnerIndex;
    }
}
