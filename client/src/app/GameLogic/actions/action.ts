import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';

export abstract class Action {
    constructor(readonly player: Player) {}

    execute(game: Game): void {
        game.doAction(this);
        this.perform(game);
    }

    protected abstract perform(game: Game): void;
}
