import { Player } from '@app/GameLogic/player/player';
import { LetterBag } from '../letter-bag';

export class Game {
    static maxConsecutivePass = 6;
    letterBag: LetterBag;
    players: Player[];
    consecutivePass: number;
    isEnded: boolean = false;

    startGame(): void {
        while (!this.isEndOfGame()) {
            this.startTurn();
        }
        this.onEndOfGame();
    }

    allocateGameLetters() {
        for (const player of this.players) {
            player.letterRack = this.letterBag.drawEmptyRackLetters();
            player.displayGameLetters();
            this.letterBag.displayNumberGameLettersLeft();
        }
    }

    startTurn() {
        //while ()
    }

    isEndOfGame() {
        return 0; //this.letterBag.gameLetters.length === 0 || this.consecutivePass === Game.maxConsecutivePass;
    }

    onEndOfGame() {}
}
