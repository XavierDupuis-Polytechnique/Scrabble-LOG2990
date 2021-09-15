import { Action } from '@app/GameLogic/actions/action';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Subject } from 'rxjs';

export abstract class Player {
    static defaultName = 'QWERTY';
    action$: Subject<Action> = new Subject();
    // nextAction: Action;

    points: number = 0;
    name: string = Player.defaultName;
    isActive: boolean;
    letterRack: Letter[];

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
