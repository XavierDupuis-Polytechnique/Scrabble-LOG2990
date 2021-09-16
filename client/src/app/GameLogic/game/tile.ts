import { Letter } from './letter.interface';

export class Tile {
    letterObject: Letter = { char: ' ', value: 0 };
    letterMultiplicator: number = 1;
    wordMultiplicator: number = 1;

    constructor(lMul?: number, wMul?: number) {
        if (lMul !== undefined) {
            this.letterMultiplicator = lMul;
        }
        if (wMul !== undefined) {
            this.wordMultiplicator = wMul;
        }
    }
}
