import { Action } from '@app/game-logic/actions/action';
import { Game } from '@app/game-logic/game/games/game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class NineLettersWord extends Objective {
    name = 'Mot de 9 lettres';
    description = 'Former un mot de 9 lettres';

    updateProgression(action: Action, game: Game): void {
        throw new Error('Method not implemented.');
    }
}
