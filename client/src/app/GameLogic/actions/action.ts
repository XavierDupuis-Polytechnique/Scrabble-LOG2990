import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';
import { Observable, Subject } from 'rxjs';

export abstract class Action {
    static id = 0;
    id;

    private endSubject = new Subject<void>();
    get end$(): Observable<void> {
        return this.endSubject;
    }

    constructor(readonly player: Player) {
        this.id = Action.id++;
    }

    execute(game: Game): void {
        console.log('ACTION #', this.id, ' ', this, ' executed');
        game.doAction(this);
        this.perform(game);
    }

    protected end() {
        this.endSubject.next();
        this.endSubject.complete();
    }

    protected abstract perform(game: Game): void;
}
