import { Vec2 } from '@app/classes/vec2';

export const VERTICAL = true;
export const HORIZONTAL = false;

export class ValidWord {
    word: string;
    adjacentWords: string[];
    lettersToAdd: string;
    startingTile: Vec2;
    isVertical: boolean;
    value: number;

    constructor(
        word: string = 'default',
        adjacentWords?: string[],
        lettersToAdd?: string,
        startingTile?: number,
        isVertical?: boolean,
        value?: number,
    ) {
        this.word = word;
    }
}
