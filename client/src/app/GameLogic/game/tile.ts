import { EMPTY_CHAR } from '@app/GameLogic/constants';
import { Letter } from './letter.interface';

export class Tile {
    letterObject: Letter = { char: EMPTY_CHAR, value: 0 };
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
