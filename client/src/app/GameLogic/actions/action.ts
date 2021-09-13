import { Game } from "../game/games/game";
import { Player } from "../player/player";

export abstract class Action {
    constructor(readonly player: Player) {}

    execute(game: Game): void {
        game.doAction(this);
        this.insideExecute(game);
    }

    protected abstract insideExecute(game: Game): void;
}
