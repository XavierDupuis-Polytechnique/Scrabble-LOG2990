import { Action } from '@app/GameLogic/actions/action';
export class PassTurn extends Action {
    protected perform() {
        this.end();
    }
}
