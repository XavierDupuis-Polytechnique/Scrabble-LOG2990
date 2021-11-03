import { Action } from '@app/game/game-logic/actions/action';
import { PassTurn } from '@app/game/game-logic/actions/pass-turn';
import { Board } from '@app/game/game-logic/board/board';
import { LetterBag } from '@app/game/game-logic/board/letter-bag';
import { MAX_CONSECUTIVE_PASS } from '@app/game/game-logic/constants';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { Timer } from '@app/game/game-logic/timer/timer.service';
import { SystemMessagesService } from '@app/messages-service/system-messages.service';
import { GameCompiler } from '@app/services/game-compiler.service';
import { first, mapTo, merge, Subject } from 'rxjs';

export class ServerGame {
    static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
    letterBag: LetterBag = new LetterBag();
    players: Player[] = [];
    activePlayerIndex: number;
    consecutivePass: number = 0;
    board: Board;
    timer: Timer;
    winnerByForfeitedIndex: number;

    isEnded$ = new Subject<undefined>();
    private isEndedValue: boolean = false;
    get isEnded() {
        return this.isEndedValue;
    }

    constructor(
        timerController: TimerController,
        public randomBonus: boolean,
        public timePerTurn: number,
        public gameToken: string,
        private pointCalculator: PointCalculatorService,
        private gameCompiler: GameCompiler,
        private messagesService: SystemMessagesService,
        private newGameStateSubject: Subject<GameStateToken>,
        private endGameSubject: Subject<string>,
    ) {
        this.timer = new Timer(gameToken, timerController);
        this.board = new Board(randomBonus);
    }

    start(): void {
        if (this.players.length < 2) {
            throw Error('Game started with less than 2 players');
        }
        this.drawGameLetters();
        this.pickFirstPlayer();
        this.emitGameState();
        this.startTurn();
    }

    stop() {
        this.isEndedValue = true;
        this.isEnded$.next(undefined);
    }

    nextPlayer() {
        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    }

    isEndOfGame() {
        if (this.isEnded) {
            return true;
        }
        if (this.letterBag.isEmpty) {
            for (const player of this.players) {
                if (player.isLetterRackEmpty) {
                    return true;
                }
            }
        }
        if (this.consecutivePass >= ServerGame.maxConsecutivePass) {
            return true;
        }
        return false;
    }

    getActivePlayer() {
        return this.players[this.activePlayerIndex];
    }

    onEndOfGame() {
        this.pointCalculator.endOfGamePointDeduction(this);
        this.displayLettersLeft();
        this.emitGameState();
        this.endGameSubject.next(this.gameToken);
    }

    doAction(action: Action) {
        if (action instanceof PassTurn) {
            this.consecutivePass += 1;
        } else {
            this.consecutivePass = 0;
        }
    }

    getWinner(): Player[] {
        let highestScore = Number.MIN_SAFE_INTEGER;
        let winners: Player[] = [];
        if (this.winnerByForfeitedIndex !== undefined) {
            const winner = this.players[this.winnerByForfeitedIndex];
            winners = [winner];
            return winners;
        }

        for (const player of this.players) {
            if (player.points === highestScore) {
                winners.push(player);
            }
            if (player.points > highestScore) {
                highestScore = player.points;
                winners = [player];
            }
        }
        return winners;
    }

    forfeit(playerName: string) {
        this.winnerByForfeitedIndex = this.players.findIndex((player) => {
            return player.name !== playerName;
        });
    }

    private pickFirstPlayer() {
        const max = this.players.length;
        const firstPlayer = Math.floor(Math.random() * max);
        this.activePlayerIndex = firstPlayer;
    }

    private drawGameLetters() {
        for (const player of this.players) {
            player.letterRack = this.letterBag.drawEmptyRackLetters();
        }
    }

    private startTurn() {
        if (this.isEnded) {
            this.onEndOfGame();
            return;
        }
        const activePlayer = this.players[this.activePlayerIndex];
        const timerEnd$ = this.timer.start(this.timePerTurn).pipe(mapTo(new PassTurn(activePlayer)));
        const turnEnds$ = merge(activePlayer.action$, timerEnd$, this.isEnded$);
        turnEnds$.pipe(first()).subscribe((action) => this.endOfTurn(action));
    }

    private endOfTurn(action: Action | undefined) {
        this.timer.stop();
        if (!action) {
            this.onEndOfGame();
            return;
        }

        if (this.isEnded) {
            this.onEndOfGame();
            return;
        }

        action.end$.subscribe(() => {
            if (this.isEndOfGame()) {
                this.onEndOfGame();
                return;
            }
            this.nextPlayer();
            this.emitGameState();
            this.startTurn();
        });

        action.execute(this);
    }

    private emitGameState() {
        const gameState = this.gameCompiler.compile(this);
        const gameStateToken: GameStateToken = { gameState, gameToken: this.gameToken };
        this.newGameStateSubject.next(gameStateToken);
    }

    private displayLettersLeft() {
        let message = 'Fin de partie - lettres restantes';
        this.messagesService.sendGlobal(this.gameToken, message);
        for (const player of this.players) {
            message = `${player.name}: ${player.printLetterRack()}`;
            this.messagesService.sendGlobal(this.gameToken, message);
        }
    }
}
