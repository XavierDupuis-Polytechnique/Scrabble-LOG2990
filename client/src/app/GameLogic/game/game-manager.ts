import { Bot } from '../player/bot';
import { Player } from '../player/player';
import { TileManager } from './tile-manager';

export class GameManager {
    tileManager: TileManager;
    players:Player[];

    constructor(p1:Player, p2?:Player){
        this.tileManager = new TileManager();
        this.players = [p1];
        console.log(this.players.length);
        typeof p2 === 'undefined' ? this.players.push(new Bot(p1.name)) : this.players.push(p2);
    }

    createGame() {
        console.log( " P1 : " + this.players[0].name);
        console.log( " P2 : " + this.players[1].name);
    }

}
