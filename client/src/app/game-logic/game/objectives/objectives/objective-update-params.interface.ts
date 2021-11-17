import { Letter } from '@app/game-logic/game/board/letter.interface';
import { Tile } from '@app/game-logic/game/board/tile';

// TODO maybe find a better name
export interface ObjectiveUpdateParams {
    previousGrid: Tile[][];
    currentGrid: Tile[][];
    lettersToPlace: Letter[];
    formedWords: Tile[][];
}
