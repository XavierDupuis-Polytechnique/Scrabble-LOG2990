import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';

// TODO: add isEnded$ attribute to know when the action ended;
export abstract class Action {
    static id = 0;
    id;
    constructor(readonly player: Player) {
        this.id = Action.id++;
    }

    execute(game: Game): void {
        //console.log('ACTION #', this.id, ' ', this, ' executed');
        game.doAction(this);
        this.perform(game);
    }

    protected abstract perform(game: Game): void;
}
