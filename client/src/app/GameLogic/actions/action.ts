import { Game } from "../game/games/game";
import { Player } from "../player/player";

export abstract class Action {
    constructor(readonly player: Player) {}
    
    abstract execute(game: Game): void;
}
