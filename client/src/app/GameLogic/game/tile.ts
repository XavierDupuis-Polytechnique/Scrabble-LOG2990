import { Letter } from '@app/GameLogic/game/letter';

export class Tile {
    letterO: Letter = new Letter();
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
