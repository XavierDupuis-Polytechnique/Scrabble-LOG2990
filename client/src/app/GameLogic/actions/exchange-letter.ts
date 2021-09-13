import { Game } from '../game/games/game';
import { Player } from '../player/player';
import { Action } from './action';

export class ExchangeLetter extends Action {
    constructor(player: Player) {
        super(player);
    }

    execute(game: Game) {
        return;
    }
}
