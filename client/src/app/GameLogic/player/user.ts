import { Player } from './player';

export class User extends Player {
    constructor(name: string){
        super(name);
    }
    
    hello():void{
        console.log("hello from User " + this.name);
    }
}
