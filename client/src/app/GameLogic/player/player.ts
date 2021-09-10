import { GameLetter } from '../game/game-letter';

export class Player {
    static defaultName = 'QWERTY';
    points: number = 0;

    name: string;
    isActive: boolean;
    letterRack: GameLetter[];

    constructor(name?: string) {
        typeof name === 'undefined' ? (this.name = Player.defaultName) : (this.name = name);
    }

    hello(): void {
        console.log('hello from Player ' + this.name);
    }

    displayGameLetters(): void {
        console.log(this.letterRack);
    }
}
