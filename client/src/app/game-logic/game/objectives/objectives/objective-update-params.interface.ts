import { Letter } from '@app/game-logic/game/board/letter.interface';
import { Tile } from '@app/game-logic/game/board/tile';
import { Vec2 } from '@app/game-logic/interfaces/vec2';

export interface ObjectiveUpdateParams {
    previousGrid: Tile[][];
    currentGrid: Tile[][];
    lettersToPlace: Letter[];
    formedWords: Tile[][];
    affectedCoords: Vec2[];
}
