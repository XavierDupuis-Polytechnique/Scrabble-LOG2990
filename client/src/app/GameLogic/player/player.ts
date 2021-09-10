import { Tile } from "../game/tile";

export class Player {
    static defaultName = 'QWERTY';

    name: string;
    isActive: boolean;
    letterRack: Tile[];

    constructor(name?: string){
        typeof name === 'undefined'?  this.name = Player.defaultName : this.name = name;
    }

    hello():void{
        console.log("hello from Player " + this.name);
    }

    displayTiles():void{
        console.log(this.letterRack);
    }
}
