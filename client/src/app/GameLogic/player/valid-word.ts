import { Tile } from '@app/GameLogic/game/tile';

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
        public adjacentWords: Tile[][] = [],
        public value: number = 0,
        // public validWord?: ValidWord,
    ) {
        // if (validWord) {
        //     this.word = validWord.word;
        //     this.indexFound = validWord.indexFound;
        //     this.emptyCount = validWord.emptyCount;
        //     this.leftCount = validWord.leftCount;
        //     this.rightCount = validWord.rightCount;
        //     this.isVertical = validWord.isVertical;
        //     this.startingTileX = validWord.startingTileX;
        //     this.startingTileY = validWord.startingTileY;
        //     this.adjacentWords = validWord.adjacentWords.slice();
        //     this.value = validWord.value;
        // }
    }
}
