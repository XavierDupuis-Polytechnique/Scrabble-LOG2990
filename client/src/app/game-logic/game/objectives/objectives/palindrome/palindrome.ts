import { Action } from '@app/game-logic/actions/action';
import { Board } from '@app/game-logic/game/board/board';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class Palindrome extends Objective {
    name = 'Engage le jeu, que je le gagne';
    description = 'Former un palindrome';

    updateProgression(action: Action, boardBefore: Board, boardAfter: Board): void {
        throw new Error('Method not implemented.');
    }
}
