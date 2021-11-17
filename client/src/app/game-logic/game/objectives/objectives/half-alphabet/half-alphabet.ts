import { Action } from '@app/game-logic/actions/action';
import { Board } from '@app/game-logic/game/board/board';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class HalfAlphabet extends Objective {
    name = "Moitié de l'alphabet";
    description = "Placer la moitié des lettres de l'alphabet";

    updateProgression(action: Action, boardBefore: Board, boardAfter: Board): void {
        throw new Error('Method not implemented.');
    }
}
