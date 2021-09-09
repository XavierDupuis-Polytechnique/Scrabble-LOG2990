import { Player } from './player';

export class Bot extends Player {
    constructor(name: string) {
        super(name);
    }

    hello(): void {
        console.log('hello from bot ' + this.name);
    }
}
