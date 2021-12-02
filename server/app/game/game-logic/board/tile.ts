import { EMPTY_CHAR } from '@app/game/game-logic/constants';
import { Letter } from './letter.interface';

export class Tile {
    letterObject: Letter = { char: EMPTY_CHAR, value: 0 };

    constructor(public letterMultiplicator: number = 1, public wordMultiplicator: number = 1) {}
}
