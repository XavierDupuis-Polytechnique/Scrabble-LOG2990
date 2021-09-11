import { Player } from '@app/GameLogic/player/player';
import { LetterBag } from '../letter-bag';
import { TimerService } from '../timer/timer.service';


export class Game {
    static maxConsecutivePass = 6;
    letterBag: LetterBag = new LetterBag();
    players: Player[] = [];
    activePlayerIndex: number;
    consecutivePass: number;
    isEnded: boolean = false;

    constructor(
        public timePerTurn: number,
        private timer: TimerService
    ){ }

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
        console.log('its', this.players[this.activePlayerIndex], 'turns');
        const timerEnd$ = this.timer.start(this.timePerTurn);
        timerEnd$.subscribe(this.endOfTurn());
        // TODO merge with player.action$ observable
    }
    
    private endOfTurn(){
        return () => {
            console.log('end of turn');
            this.nextPlayer();
            this.startTurn();
        }
    }

    nextPlayer() {
        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    }

    isEndOfGame() {
        return 0; //this.letterBag.gameLetters.length === 0 || this.consecutivePass === Game.maxConsecutivePass;
    }

    onEndOfGame() {}
}
