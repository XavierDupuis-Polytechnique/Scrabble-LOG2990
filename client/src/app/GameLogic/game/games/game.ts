/* eslint-disable no-restricted-imports */
import { Action } from '@app/GameLogic/actions/action';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { Player } from '@app/GameLogic/player/player';
import { merge } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { LetterBag } from '../letter-bag';
import { TimerService } from '../timer/timer.service';

const MAX_CONSECUTIVE_PASS = 6;

export class Game {
    static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
    letterBag: LetterBag = new LetterBag();
    players: Player[] = [];
    activePlayerIndex: number;
    consecutivePass: number = 0;
    isEnded: boolean = false;

    constructor(public timePerTurn: number, private timer: TimerService) {}

    start(): void {
        this.drawGameLetters();
        this.pickFirstPlayer();
        this.startTurn();
    }

    private pickFirstPlayer() {
        const max = this.players.length;
        const firstPlayer = Math.floor(Math.random() * max);
        this.activePlayerIndex = firstPlayer;
    }

    private drawGameLetters() {
        for (const player of this.players) {
            player.letterRack = this.letterBag.drawEmptyRackLetters();
            player.displayGameLetters();
            this.letterBag.displayNumberGameLettersLeft();
        }
    }

    private startTurn() {
        // TODO timerends emits passturn action + feed action in end turn arguments
        const activePlayer = this.players[this.activePlayerIndex];
        console.log('its', activePlayer, 'turns');
        const timerEnd$ = this.timer.start(this.timePerTurn).pipe(mapTo(new PassTurn(activePlayer)));
        const turnEnds$ = merge(activePlayer.action$, timerEnd$);
        turnEnds$.subscribe((action) => this.endOfTurn(action));
    }
    // TODO implement action execute
    private endOfTurn(action: Action){
        action.execute(this);
        console.log('end of turn');
        this.nextPlayer();
        this.startTurn();
    }

    nextPlayer() {
        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    }

    isEndOfGame() {
        return 0; //this.letterBag.gameLetters.length === 0 || this.consecutivePass === Game.maxConsecutivePass;
    }

    onEndOfGame() {}

    doAction(action: Action) {
        if (action instanceof PassTurn) {
            this.consecutivePass += 1;
        } else {
            this.consecutivePass = 0;
        }
    }
}
