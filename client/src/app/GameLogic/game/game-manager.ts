import { Bot } from '../player/bot';
import { Player } from '../player/player';
import { TileManager } from './tile-manager';

export class GameManager {
    tileManager: TileManager;
    players:Player[];

    constructor(p1:Player, p2?:Player){
        this.tileManager = new TileManager();
        this.allocatePlayers(p1, p2);
        this.allocateTiles();
    }

    createGame() {
        console.log( " P1 : " + this.players[0].name);
        console.log( " P2 : " + this.players[1].name);
    }

    allocatePlayers(p1:Player, p2?:Player){
        this.players = [];
        this.players.push(p1);
        console.log(this.players.length);
        typeof p2 === 'undefined' ? this.players.push(new Bot(p1.name)) : this.players.push(p2);
    }

    allocateTiles(){
        for(let i = 0; i < this.players.length; i++){
            this.players[i].letterRack = this.tileManager.drawGameTiles();
            this.players[i].displayTiles();
            this.tileManager.displayNumberTilesLeft();
        }
    }
}
