import { Subject } from 'rxjs';
import { Action } from '../actions/action';
import { Letter } from '../game/letter.interface';

export abstract class Player {
    static defaultName = 'QWERTY';
    points: number = 0;

    name: string = Player.defaultName;
    isActive: boolean;
    letterRack: Letter[];
    action$: Subject<Action> = new Subject();

    constructor(name?: string) {
        if (name) {
            this.name = name;
        }
    }

    abstract play(): void;
    abstract exchange(): void;
    abstract pass(): void;

    hello(): void {
        console.log('hello from Player ' + this.name);
    }

    displayGameLetters(): void {
        console.log(this.letterRack);
    }

    get letterRackIsEmpty(): boolean {
        return this.letterRack.length === 0;
    }
}
