export class Tile {
    letter: string;
    value: number;
    letterMultiplicator: number;
    wordMultiplicator: number;

    constructor(lMul?: number, wMul?: number) {
        this.letter = '';
        this.value = 1;
        this.letterMultiplicator = 1;
        this.wordMultiplicator = 1;
        if (lMul !== undefined) {
            this.letterMultiplicator = lMul;
        }
        if (wMul !== undefined) {
            this.wordMultiplicator = wMul;
        }
    }
}
