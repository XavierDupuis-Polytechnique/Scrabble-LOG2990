import { Action } from '@app/game-logic/actions/action';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { MAX_CONSECUTIVE_PASS } from '@app/game-logic/constants';
import { Board } from '@app/game-logic/game/board/board';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { LetterBag } from '@app/game-logic/game/board/letter-bag';
import { Game } from '@app/game-logic/game/games/game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { Player } from '@app/game-logic/player/player';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { merge } from 'rxjs';
import { first, mapTo } from 'rxjs/operators';

export class OfflineGame extends Game {
    static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
    letterBag: LetterBag = new LetterBag();
    players: Player[] = [];
    board: Board;
    activePlayerIndex: number = 0;
    consecutivePass: number = 0;
    turnNumber: number = 0;

    constructor(
        public randomBonus: boolean,
        public timePerTurn: number,
        private timer: TimerService,
        private pointCalculator: PointCalculatorService,
        private boardService: BoardService,
        private messagesService: MessagesService,
        loadGame: boolean = false,
    ) {
        super();
        if (loadGame) {
            return;
        }
        this.board = new Board(randomBonus);
        this.boardService.board = this.board;
    }

    getNumberOfLettersRemaining(): number {
        return this.letterBag.lettersLeft;
    }

    start(): void {
        if (this.players.length === 0) {
            throw Error('Game started with no players');
        }
        this.drawGameLetters();
        this.pickFirstPlayer();
        this.startTurn();
    }

    resume(activePlayerIndex: number) {
        if (this.players.length === 0) {
            throw Error('Game started with no players');
        }
        this.activePlayerIndex = activePlayerIndex;
        this.startTurn();
    }

    stop() {
        this.timer.stop();
    }

    isEndOfGame() {
        if (this.letterBag.isEmpty) {
            for (const player of this.players) {
                if (player.isLetterRackEmpty) {
                    return true;
                }
            }
        }
        if (this.consecutivePass >= OfflineGame.maxConsecutivePass) {
            return true;
        }
        return false;
    }

    getActivePlayer() {
        return this.players[this.activePlayerIndex];
    }

    doAction(action: Action) {
        if (action instanceof PassTurn) {
            this.consecutivePass += 1;
            return;
        }
        this.consecutivePass = 0;
    }

    getWinner(): Player[] {
        let highestScore = Number.MIN_SAFE_INTEGER;
        let winners: Player[] = [];
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

    private onEndOfGame() {
        this.pointCalculator.endOfGamePointDeduction(this);
        this.displayLettersLeft();
        this.isEndOfGameSubject.next();
    }

    private nextPlayer() {
        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
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
        this.turnNumber++;
        const activePlayer = this.players[this.activePlayerIndex];
        activePlayer.setActive();
        const timerEnd$ = this.timer.start(this.timePerTurn).pipe(mapTo(new PassTurn(activePlayer)));
        const turnEnds$ = merge(activePlayer.action$, timerEnd$);
        turnEnds$.pipe(first()).subscribe((action) => this.endOfTurn(action));
    }

    private endOfTurn(action: Action) {
        this.timer.stop();

        action.end$.subscribe(() => {
            if (this.isEndOfGame()) {
                this.onEndOfGame();
                return;
            }
            this.nextPlayer();
            this.startTurn();
            this.endTurnSubject.next();
        });

        action.execute(this);
    }

    private displayLettersLeft() {
        let message = 'Fin de partie - lettres restantes';
        this.messagesService.receiveSystemMessage(message);
        for (const player of this.players) {
            message = `${player.name}: ${player.printLetterRack()}`;
            this.messagesService.receiveSystemMessage(message);
        }
    }
}
