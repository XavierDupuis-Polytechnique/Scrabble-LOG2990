import { Action } from '@app/game-logic/actions/action';
import { BOARD_MAX_POSITION, BOARD_MIN_POSITION, EMPTY_CHAR, FOUR_CORNERS_POINTS, N_CORNERS } from '@app/game-logic/constants';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

export class FourCorners extends Objective {
    name = 'Quatre Coins';
    description = 'Être le joueur à remplir le 4e coin de la planche de jeu';
    points = FOUR_CORNERS_POINTS;

    protected updateProgression(action: Action, params: ObjectiveUpdateParams) {
        let newProgression = 0;
        const grid = params.currentGrid;

        if (grid[BOARD_MIN_POSITION][BOARD_MIN_POSITION].letterObject.char !== EMPTY_CHAR) {
            newProgression += 1 / N_CORNERS;
        }

        if (grid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject.char !== EMPTY_CHAR) {
            newProgression += 1 / N_CORNERS;
        }

        if (grid[BOARD_MIN_POSITION][BOARD_MAX_POSITION].letterObject.char !== EMPTY_CHAR) {
            newProgression += 1 / N_CORNERS;
        }

        if (grid[BOARD_MAX_POSITION][BOARD_MAX_POSITION].letterObject.char !== EMPTY_CHAR) {
            newProgression += 1 / N_CORNERS;
        }

        this.setPlayerProgression(action.player.name, newProgression);
    }
}
