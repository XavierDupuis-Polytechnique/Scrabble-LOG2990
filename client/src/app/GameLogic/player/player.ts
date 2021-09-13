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

    get letterRackIsEmpty(): boolean {
        return this.letterRack.length === 0;
    }

    action$: Subject<Action> = new Subject();
}
