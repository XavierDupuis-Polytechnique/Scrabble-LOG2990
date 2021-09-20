export const VERTICAL = true;
export const HORIZONTAL = false;

export class ValidWord {
    word: string;
    adjacentWords: string[];
    startingTileX: number;
    startingTileY: number;
    isVertical: boolean;
    value: number;

    constructor(word: string, adjacentWords?: string[], startingTileX?: number, startingTileY?: number, isVertical?: boolean, value?: number) {
        this.word = word;
        this.adjacentWords = adjacentWords || [];
        this.startingTileX = startingTileX || 0;
        this.startingTileY = startingTileY || 0;
        this.isVertical = isVertical || false;
        this.value = value || 0;
    }
}
