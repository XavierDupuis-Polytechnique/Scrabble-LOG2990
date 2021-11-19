import { Vec2 } from '@app/classes/vec2';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { Tile } from '@app/game/game-logic/board/tile';

export interface ObjectiveUpdateParams {
    previousGrid: Tile[][];
    currentGrid: Tile[][];
    lettersToPlace: Letter[];
    formedWords: Tile[][];
    affectedCoords: Vec2[];
}
