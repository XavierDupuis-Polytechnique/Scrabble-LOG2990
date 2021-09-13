import { Game } from "../game/games/game";
import { Player } from "../player/player";
import { Action } from "./action";

export class PassTurn extends Action {
    constructor(player: Player) {
        super(player);
    }

    protected insideExecute(game: Game) {
        console.log(this.player.name, 'passed his turn');
        return;
    }
}
