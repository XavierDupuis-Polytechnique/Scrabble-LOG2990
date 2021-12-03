import { Action } from '@app/game-logic/actions/action';
import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { EMPTY_CHAR, JOKER_CHAR, NOT_FOUND, RACK_LETTER_COUNT } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { Board } from '@app/game-logic/game/board/board';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { LetterCreator } from '@app/game-logic/game/board/letter-creator';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { Game } from '@app/game-logic/game/games/game';
import { GameState } from '@app/game-logic/game/games/online-game/game-state';
import { TimerControls } from '@app/game-logic/game/timer/timer-controls.enum';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { Player } from '@app/game-logic/player/player';
import { isCharUpperCase } from '@app/game-logic/utils';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { OnlineAction } from '@app/socket-handler/interfaces/online-action.interface';
import { Subscription } from 'rxjs';

interface PlayerWithIndex {
    index: number;
    player: Player;
}

export class OnlineGame extends Game {
    players: Player[] = [];
    activePlayerIndex: number = 0;
    lettersRemaining: number = 0;
    hasGameEnded: boolean = false;
    winnerNames: string[];
    playersWithIndex = new Map<string, PlayerWithIndex>();
    private letterCreator = new LetterCreator();

    private gameState$$: Subscription;
    private timerControls$$: Subscription;

    constructor(
        public gameToken: string,
        public timePerTurn: number,
        public userName: string,
        private timer: TimerService,
        private onlineSocket: GameSocketHandlerService,
        private boardService: BoardService,
        private onlineActionCompiler: OnlineActionCompilerService,
    ) {
        super();
        this.boardService.board = new Board();

        this.gameState$$ = this.onlineSocket.gameState$.subscribe((gameState: GameState) => {
            this.receiveState(gameState);
        });

        this.timerControls$$ = this.onlineSocket.timerControls$.subscribe((timerControl: TimerControls) => {
            this.receiveTimerControl(timerControl);
        });
    }

    getNumberOfLettersRemaining(): number {
        return this.lettersRemaining;
    }

    start(): void {
        return;
    }

    isEndOfGame(): boolean {
        return this.hasGameEnded;
    }

    stop() {
        this.timer.stop();
        this.forfeit();
        this.close();
    }

    close() {
        this.gameState$$.unsubscribe();
        this.timerControls$$.unsubscribe();
    }

    receiveState(gameState: GameState) {
        if (this.playersWithIndex.size === 0) {
            this.setupPlayersWithIndex();
        }
        this.endTurnSubject.next();
        this.updateClient(gameState);
    }

    handleUserActions() {
        const user = this.players.find((player: Player) => {
            return player.name === this.userName;
        });
        (user as Player).action$.subscribe((action) => {
            const activePlayerName = this.players[this.activePlayerIndex].name;
            if (activePlayerName !== this.userName) {
                return;
            }
            this.receivePlayerAction(action);
        });
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

    protected updateClient(gameState: GameState) {
        this.updateBoard(gameState);
        this.updateActivePlayer(gameState);
        this.updatePlayers(gameState);
        this.updateLettersRemaining(gameState);
        this.updateEndOfGame(gameState);
    }

    private forfeit() {
        if (!this.onlineSocket.socket) {
            return;
        }
        this.onlineSocket.disconnect();
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

        if (action instanceof PlaceLetter) {
            this.placeTemporaryLetter(action);
        }
    }

    private placeTemporaryLetter(action: PlaceLetter) {
        const startX = action.placement.x;
        const startY = action.placement.y;
        const direction = action.placement.direction;
        const word = action.word;
        const grid = this.boardService.board.grid;
        const player = action.player;
        for (let wordIndex = 0; wordIndex < word.length; wordIndex++) {
            const [x, y] = direction === Direction.Horizontal ? [startX + wordIndex, startY] : [startX, startY + wordIndex];
            const char = grid[y][x].letterObject.char;

            if (char === EMPTY_CHAR) {
                const charToCreate = word[wordIndex];
                const newLetter = this.createTmpLetter(charToCreate);
                grid[y][x].letterObject = newLetter;
                if (isCharUpperCase(charToCreate)) {
                    this.removeLetter(player.letterRack, JOKER_CHAR);
                }
                this.removeLetter(player.letterRack, newLetter.char);
            }
        }
    }

    private createTmpLetter(char: string) {
        const charToCreate = char.toLowerCase();
        if (isCharUpperCase(char)) {
            return this.letterCreator.createBlankLetter(charToCreate);
        }
        return this.letterCreator.createLetter(charToCreate);
    }

    private removeLetter(letterRack: Letter[], newLetter: string) {
        const index = letterRack.findIndex((letter) => {
            return letter.char === newLetter;
        });
        if (index !== NOT_FOUND) {
            letterRack.splice(index, 1);
        }
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

    private updateBoard(gameState: GameState) {
        this.boardService.board.grid = gameState.grid;
    }

    private updateActivePlayer(gameState: GameState) {
        const activePlayerIndex = gameState.activePlayerIndex;
        const activePlayerName = gameState.players[activePlayerIndex].name;
        const playerWithIndex = this.playersWithIndex.get(activePlayerName);
        if (!playerWithIndex) {
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
            if (letterCount === 0 || letterCount === undefined) {
                isChanged = true;
                return isChanged;
            }
            mapRack.set(letter.char, letterCount - 1);
        }
        return isChanged;
    }

    private makeLetterRackMap(letterRack: Letter[]): Map<string, number> {
        const mapRack = new Map<string, number>();
        for (const letter of letterRack) {
            const letterCount = mapRack.get(letter.char);
            if (letterCount) {
                mapRack.set(letter.char, letterCount + 1);
                continue;
            }
            mapRack.set(letter.char, 1);
        }
        return mapRack;
    }

    private updateEndOfGame(gameState: GameState) {
        this.hasGameEnded = gameState.isEndOfGame;
        this.winnerNames = gameState.winnerIndex.map((index: number) => {
            return gameState.players[index].name;
        });
        if (gameState.isEndOfGame) {
            this.isEndOfGameSubject.next();
        }
    }
}
