import { Bot } from '@app/GameLogic/player/bot';
import { Player } from '@app/GameLogic/player/player';
import { LetterBag } from '../letter-bag';

export class Game {
    letterBag: LetterBag;
    players: Player[];

    constructor(p1: Player, p2?: Player) {
        this.letterBag = new LetterBag();
        this.createGame(p1, p2);
    }

    createGame(p1: Player, p2?: Player) {
        this.allocatePlayers(p1, p2);
        this.allocateGameLetters();
        console.log(' P1 : ' + this.players[0].name);
        console.log(' P2 : ' + this.players[1].name);
    }

    allocatePlayers(p1: Player, p2?: Player) {
        this.players = [];
        this.players.push(p1);
        typeof p2 === 'undefined' ? this.players.push(new Bot(p1.name)) : this.players.push(p2);
    }

    allocateGameLetters() {
        for (const player of this.players) {
            player.letterRack = this.letterBag.drawGameGameLetters();
            player.displayGameLetters();
            this.letterBag.displayNumberGameLettersLeft();
        }
    }
}
