import { Tile } from '@app/game/game-logic/board/tile';

export interface Word {
    letters: Tile[];
    index: number[];
}
