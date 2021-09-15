import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';

export abstract class Action {
    constructor(readonly player: Player) {}

    perform(game: Game): void {
        game.doAction(this);
        this.execute(game);
    }

    protected abstract execute(game: Game): void;
}
