import { Tile } from '@app/GameLogic/game/tile';

export const VERTICAL = true;
export const HORIZONTAL = false;

export class ValidWord {
    constructor(
        public word: string,
        public indexFound: number = 0,
        public emptyCount: number = 0,
        public leftCount: number = 0,
        public rightCount: number = 0,
        public isVertical: boolean = false,
        public startingTileX: number = 0,
        public startingTileY: number = 0,
        public adjacentWords: Tile[][] = [],
        public value: number = 0,
    ) {}
}
