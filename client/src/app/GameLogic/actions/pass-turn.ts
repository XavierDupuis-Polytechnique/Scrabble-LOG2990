import { Game } from '@app/GameLogic/game/games/game';
import { Action } from './action';

export class PassTurn extends Action {
    // TODO implement PassTurn action
    protected insideExecute(game: Game) {
        // console.log(this.player.name, 'passed his turn');
        // return;
    }
}
