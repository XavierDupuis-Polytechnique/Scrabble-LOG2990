import { Action } from '@app/game-logic/actions/action';
import { Game } from '@app/game-logic/game/games/game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class SameWordTwice extends Objective {
    name = "1 c'est bien mais 2 c'est mieux";
    description = 'Former deux fois le même mot dans un même placement';

    updateProgression(action: Action, game: Game): void {
        throw new Error('Method not implemented.');
    }
}
