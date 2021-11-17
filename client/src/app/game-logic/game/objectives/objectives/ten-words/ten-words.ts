import { Action } from '@app/game-logic/actions/action';
import { Board } from '@app/game-logic/game/board/board';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class TenWords extends Objective {
    name = '10 mots';
    description = 'Placer au moins 10 mots dans une partie.';

    updateProgression(action: Action, boardBefore: Board, boardAfter: Board): void {
        throw new Error('Method not implemented.');
    }
}
