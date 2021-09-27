import { Action } from '@app/GameLogic/actions/action';
import { Game } from '@app/GameLogic/game/games/game';

export class PassTurn extends Action {
    // eslint-disable-next-line no-unused-vars
    protected perform(game: Game) {
        this.end();
    }
}
