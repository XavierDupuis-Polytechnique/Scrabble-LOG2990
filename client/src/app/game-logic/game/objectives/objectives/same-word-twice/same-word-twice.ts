import { Action } from '@app/game-logic/actions/action';
import { Board } from '@app/game-logic/game/board/board';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class SameWordTwice extends Objective {
    name = "1 c'est bien mais 2 c'est mieux";
    description = 'Former deux fois le même mot dans un même placement';

    updateProgression(action: Action, boardBefore: Board, boardAfter: Board): void {
        throw new Error('Method not implemented.');
    }
}
