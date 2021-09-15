import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';

export abstract class Action {
    constructor(readonly player: Player) {}

    execute(game: Game): void {
        game.doAction(this);
        this.insideExecute(game);
    }

    protected abstract insideExecute(game: Game): void;
}
