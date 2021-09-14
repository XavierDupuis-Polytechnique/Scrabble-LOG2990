import { Game } from '@app/GameLogic//game/games/game';
import { Player } from '@app/GameLogic//player/player';
import { Action } from './action';

export class PassTurn extends Action {
    constructor(player: Player) {
        super(player);
    }

    execute(game: Game) {
        return;
    }
}
