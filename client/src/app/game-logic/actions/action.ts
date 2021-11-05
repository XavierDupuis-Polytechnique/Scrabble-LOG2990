import { Game } from '@app/game-logic/game/games/solo-game/game';
import { Player } from '@app/game-logic/player/player';
import { Observable, Subject } from 'rxjs';

export abstract class Action {
    private endSubject = new Subject<void>();
    get end$(): Observable<void> {
        return this.endSubject;
    }

    constructor(readonly player: Player) {}

    execute(game: Game): void {
        game.doAction(this);
        this.perform(game);
    }

    protected end() {
        this.endSubject.next();
        this.endSubject.complete();
    }

    protected abstract perform(game: Game): void;
}
