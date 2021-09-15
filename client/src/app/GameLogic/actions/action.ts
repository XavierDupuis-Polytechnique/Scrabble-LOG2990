import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';

export abstract class Action {
    static ACTION_ID = 0;
    id = 0;
    constructor(readonly player: Player) {
        this.id = Action.ACTION_ID++;
    }

    perform(game: Game): void {
        console.log('ACTION #', this.id, ' ', this, ' executed');
        game.doAction(this);
        this.execute(game);
    }

    protected abstract execute(game: Game): void;
}
