import { Subject } from 'rxjs';
import { Action } from '../actions/action';
import { GameLetter } from '../game/game-letter';

export class Player {
    static defaultName = 'QWERTY';
    points: number = 0;

    name: string = Player.defaultName;
    isActive: boolean;
    letterRack: GameLetter[];

    constructor(name?: string) {
        if (name) {
            this.name = name;
        }
    }

    hello(): void {
        console.log('hello from Player ' + this.name);
    }

    displayGameLetters(): void {
        console.log(this.letterRack);
    }

    action$: Subject<Action>;
}
