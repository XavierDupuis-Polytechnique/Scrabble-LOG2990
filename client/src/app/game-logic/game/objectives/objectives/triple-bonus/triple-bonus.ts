import { Action } from '@app/game-logic/actions/action';
import { TRIPLE_BONUS_NUMBER_OF_BONUS, TRIPLE_BONUS_POINTS } from '@app/game-logic/constants';
import { Tile } from '@app/game-logic/game/board/tile';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

export class TripleBonus extends Objective {
    name = 'Les 3 mousquetaires';
    description = 'Faire un placement en utilisant 3 cases bonus';
    points = TRIPLE_BONUS_POINTS;

    protected updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        let numberOfBonusUsed = 0;
        for (const coord of params.affectedCoords) {
            const x = coord.x;
            const y = coord.y;
            if (this.wasBonus(x, y, params.previousGrid)) {
                numberOfBonusUsed++;
            }
            if (numberOfBonusUsed === TRIPLE_BONUS_NUMBER_OF_BONUS) {
                this.setPlayerProgression(action.player.name, 1);
                return;
            }
        }
    }

    private wasBonus(x: number, y: number, previousGrid: Tile[][]): boolean {
        const concernedTile = previousGrid[y][x];
        const wasWordMultiplicator = concernedTile.wordMultiplicator !== 1;
        const wasLetterMutliplicator = concernedTile.letterMultiplicator !== 1;
        return wasWordMultiplicator || wasLetterMutliplicator;
    }
}
