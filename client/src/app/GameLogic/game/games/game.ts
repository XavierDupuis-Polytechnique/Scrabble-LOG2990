import { Action } from '@app/GameLogic/actions/action';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { MAX_CONSECUTIVE_PASS } from '@app/GameLogic/constants';
import { Board } from '@app/GameLogic/game/board';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Player } from '@app/GameLogic/player/player';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';
import { merge } from 'rxjs';
import { first, mapTo } from 'rxjs/operators';
export class Game {
    static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
    letterBag: LetterBag = new LetterBag();
    players: Player[] = [];
    board: Board = new Board();
    activePlayerIndex: number;
    consecutivePass: number = 0;
    turnNumber: number = 0;

    constructor(
        public timePerTurn: number,
        private timer: TimerService,
        private pointCalculator: PointCalculatorService,
        private boardService: BoardService,
        private messagesService: MessagesService,
    ) {
        this.boardService.board = this.board;
    }

    start(): void {
        if (this.players.length === 0) {
            throw Error('Game started with no players');
        }
        this.drawGameLetters();
        this.pickFirstPlayer();
        this.startTurn();
    }

    nextPlayer() {
        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    }

    isEndOfGame() {
        if (this.letterBag.isEmpty) {
            for (const player of this.players) {
                if (player.isLetterRackEmpty) {
                    return true;
                }
            }
        }
        if (this.consecutivePass >= Game.maxConsecutivePass) {
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
    }

    doAction(action: Action) {
        if (action instanceof PassTurn) {
            this.consecutivePass += 1;
        } else {
            this.consecutivePass = 0;
        }
        if (action instanceof PlaceLetter) {
            // calculer points du active player
        }
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
        // console.log('its', activePlayer, 'turns');
        const timerEnd$ = this.timer.start(this.timePerTurn).pipe(mapTo(new PassTurn(activePlayer)));
        const turnEnds$ = merge(activePlayer.action$, timerEnd$);
        turnEnds$.pipe(first()).subscribe((action) => this.endOfTurn(action));
    }

    // TODO implement action execute
    private endOfTurn(action: Action) {
        this.timer.stop();

        action.end$.subscribe(() => {
            if (this.isEndOfGame()) {
                this.onEndOfGame();
                return;
            }
            this.nextPlayer();
            this.startTurn();
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
