import { Action } from '@app/game/game-logic/actions/action';

export class PassTurn extends Action {
    protected perform() {
        this.end();
    }
}
