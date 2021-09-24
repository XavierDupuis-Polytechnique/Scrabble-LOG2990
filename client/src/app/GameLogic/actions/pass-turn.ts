import { Action } from '@app/GameLogic/actions/action';
import { Game } from '@app/GameLogic/game/games/game';

export class PassTurn extends Action {
    // TODO implement PassTurn action
    protected perform(game: Game) {
        //console.log(this.player.name, 'passed his turn');
        return;
    }
}
