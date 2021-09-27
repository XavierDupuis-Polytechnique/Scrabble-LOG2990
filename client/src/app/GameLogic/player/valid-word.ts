import { Word } from '@app/GameLogic/validator/word-search/word';

export const VERTICAL = true;
export const HORIZONTAL = false;

// TODO Change isVertical to direction ??
export class ValidWord {
    constructor(
        public word: string,
        public indexFound: number = 0,
        public emptyCount: number = 0,
        public leftCount: number = 0,
        public rightCount: number = 0,
        public isVertical: boolean = HORIZONTAL,
        public startingTileX: number = 0,
        public startingTileY: number = 0,
        public numberOfLettersPlaced: number = 0,
        public adjacentWords: Word[] = [],
        public value: number = 0,
    ) {
    }
}
