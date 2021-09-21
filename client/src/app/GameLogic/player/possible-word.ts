export class PossibleWord {
    word: string;
    indexFound: number;
    emptyCount: number;
    indexOfX: number;
    indexOfY: number;
    isVertical: boolean;

    constructor(word: string, indexFound?: number, emptyCount?: number, indexOfX?: number, indexOfY?: number, isVertical?: boolean) {
        this.word = word;
        this.indexFound = indexFound || 0;
        this.emptyCount = emptyCount || 0;
        this.indexOfX = indexOfX || 0;
        this.indexOfY = indexOfY || 0;
        this.isVertical = isVertical || false;
    }
}
