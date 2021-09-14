import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';

export abstract class Action {
    constructor(readonly player: Player) {}

    abstract execute(game: Game): void;
}
