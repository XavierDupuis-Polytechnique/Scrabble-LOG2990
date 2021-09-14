import { Letter } from '@app/GameLogic/game/letter';

export class Tile {
    letterO: Letter = new Letter();
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
