export const VERTICAL = true;
export const HORIZONTAL = false;

export class ValidWord {
    // word: string;
    // indexFound: number;
    // emptyCount: number;
    // leftCount: number;
    // rightCount: number;
    // isVertical: boolean;
    // startingTileX: number;
    // startingTileY: number;
    // adjacentWords: string[];
    // value: number;

    constructor(
        public word: string,
        public indexFound: number = 0,
        public emptyCount: number = 0,
        public leftCount: number = 0,
        public rightCount: number = 0,
        public isVertical: boolean = false,
        public startingTileX: number = 0,
        public startingTileY: number = 0,
        public adjacentWords: string[] = [],
        public value: number = 0,
    ) {
        // this.word = word;
        // this.indexFound = indexFound;
        // this.emptyCount = emptyCount || 0;
        // this.leftCount = leftCount || 0;
        // this.rightCount = rightCount || 0;
        // this.isVertical = isVertical || false;
        // this.startingTileX = startingTileX || 0;
        // this.startingTileY = startingTileY || 0;
        // this.adjacentWords = adjacentWords || [];
        // this.value = value || 0;
    }
}
