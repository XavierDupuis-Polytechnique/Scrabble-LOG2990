import { ServerGame } from '@app/game/game-logic/game/server-game';
import { Player } from '@app/game/game-logic/player/player';
import { Observable, Subject } from 'rxjs';

export abstract class Action {
    private endSubject = new Subject<void>();
    get end$(): Observable<void> {
        return this.endSubject;
    }

    constructor(readonly player: Player) {}

    execute(game: ServerGame): void {
        game.doAction(this);
        this.perform(game);
    }

    protected end() {
        this.endSubject.next();
        this.endSubject.complete();
    }

    protected abstract perform(game: ServerGame): void;
}
