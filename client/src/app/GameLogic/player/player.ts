export class Player {
    static defaultName = 'QWERTY';

    name: string;
    isActive: boolean;
    letterRack: string[];

    constructor(name?: string){
        typeof name === 'undefined'?  this.name = Player.defaultName : this.name = name;
    }

    hello():void{
        console.log("hello from Player " + this.name);
    }
}
