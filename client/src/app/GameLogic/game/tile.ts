import { Letter } from './letter.interface';

export class Tile {
    letterO: Letter = { char: ' ', value: 0 };
    letterMultiplicator: number;
    wordMultiplicator: number;

    constructor(lMul?: number, wMul?: number) {
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
