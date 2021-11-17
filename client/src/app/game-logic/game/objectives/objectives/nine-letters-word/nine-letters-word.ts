import { Action } from '@app/game-logic/actions/action';
import { Board } from '@app/game-logic/game/board/board';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class NineLettersWord extends Objective {
    name = 'Mot de 9 lettres';
    description = 'Former un mot de 9 lettres';

    updateProgression(action: Action, boardBefore: Board, boardAfter: Board): void {
        throw new Error('Method not implemented.');
    }
}
