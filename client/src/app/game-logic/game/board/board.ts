import { ASCII_CODE, BOARD_DIMENSION, EMPTY_CHAR } from '@app/game-logic/constants';
import { Tile } from './tile';
export enum MultiType {
    Letter,
    Word,
}
export interface BoardSettingPosition {
    x: number;
    y: string;
    v: number;
    type: MultiType;
}

export const MULTIPLICATORS: BoardSettingPosition[] = [
    { x: 1, y: 'A', v: 3, type: MultiType.Word },
    { x: 8, y: 'A', v: 3, type: MultiType.Word },
    { x: 15, y: 'A', v: 3, type: MultiType.Word },

    { x: 2, y: 'B', v: 2, type: MultiType.Word },
    { x: 14, y: 'B', v: 2, type: MultiType.Word },

    { x: 3, y: 'C', v: 2, type: MultiType.Word },
    { x: 13, y: 'C', v: 2, type: MultiType.Word },

    { x: 4, y: 'D', v: 2, type: MultiType.Word },
    { x: 12, y: 'D', v: 2, type: MultiType.Word },

    { x: 5, y: 'E', v: 2, type: MultiType.Word },
    { x: 11, y: 'E', v: 2, type: MultiType.Word },

    { x: 1, y: 'H', v: 3, type: MultiType.Word },
    { x: 8, y: 'H', v: 2, type: MultiType.Word },
    { x: 15, y: 'H', v: 3, type: MultiType.Word },

    { x: 5, y: 'K', v: 2, type: MultiType.Word },
    { x: 11, y: 'K', v: 2, type: MultiType.Word },

    { x: 4, y: 'L', v: 2, type: MultiType.Word },
    { x: 12, y: 'L', v: 2, type: MultiType.Word },

    { x: 3, y: 'M', v: 2, type: MultiType.Word },
    { x: 13, y: 'M', v: 2, type: MultiType.Word },

    { x: 2, y: 'N', v: 2, type: MultiType.Word },
    { x: 14, y: 'N', v: 2, type: MultiType.Word },

    { x: 1, y: 'O', v: 3, type: MultiType.Word },
    { x: 8, y: 'O', v: 3, type: MultiType.Word },
    { x: 15, y: 'O', v: 3, type: MultiType.Word },

    { x: 4, y: 'A', v: 2, type: MultiType.Letter },
    { x: 12, y: 'A', v: 2, type: MultiType.Letter },

    { x: 6, y: 'B', v: 3, type: MultiType.Letter },
    { x: 10, y: 'B', v: 3, type: MultiType.Letter },

    { x: 7, y: 'C', v: 2, type: MultiType.Letter },
    { x: 9, y: 'C', v: 2, type: MultiType.Letter },

    { x: 1, y: 'D', v: 2, type: MultiType.Letter },
    { x: 8, y: 'D', v: 2, type: MultiType.Letter },
    { x: 15, y: 'D', v: 2, type: MultiType.Letter },

    { x: 2, y: 'F', v: 3, type: MultiType.Letter },
    { x: 6, y: 'F', v: 3, type: MultiType.Letter },
    { x: 10, y: 'F', v: 3, type: MultiType.Letter },
    { x: 14, y: 'F', v: 3, type: MultiType.Letter },

    { x: 3, y: 'G', v: 2, type: MultiType.Letter },
    { x: 7, y: 'G', v: 2, type: MultiType.Letter },
    { x: 9, y: 'G', v: 2, type: MultiType.Letter },
    { x: 13, y: 'G', v: 2, type: MultiType.Letter },

    { x: 4, y: 'H', v: 2, type: MultiType.Letter },
    { x: 12, y: 'H', v: 2, type: MultiType.Letter },

    { x: 3, y: 'I', v: 2, type: MultiType.Letter },
    { x: 7, y: 'I', v: 2, type: MultiType.Letter },
    { x: 9, y: 'I', v: 2, type: MultiType.Letter },
    { x: 13, y: 'I', v: 2, type: MultiType.Letter },

    { x: 2, y: 'J', v: 3, type: MultiType.Letter },
    { x: 6, y: 'J', v: 3, type: MultiType.Letter },
    { x: 10, y: 'J', v: 3, type: MultiType.Letter },
    { x: 14, y: 'J', v: 3, type: MultiType.Letter },

    { x: 1, y: 'L', v: 2, type: MultiType.Letter },
    { x: 8, y: 'L', v: 2, type: MultiType.Letter },
    { x: 15, y: 'L', v: 2, type: MultiType.Letter },

    { x: 7, y: 'M', v: 2, type: MultiType.Letter },
    { x: 9, y: 'M', v: 2, type: MultiType.Letter },

    { x: 6, y: 'N', v: 3, type: MultiType.Letter },
    { x: 10, y: 'N', v: 3, type: MultiType.Letter },

    { x: 4, y: 'O', v: 2, type: MultiType.Letter },
    { x: 12, y: 'O', v: 2, type: MultiType.Letter },
];
export class Board {
    grid: Tile[][];

    constructor(public randomBonus: boolean = false) {
        this.initGrid(randomBonus);
    }

    hasNeighbour(x: number, y: number): boolean {
        if (x + 1 < BOARD_DIMENSION) {
            if (this.grid[y][x + 1].letterObject.char !== EMPTY_CHAR) {
                return true;
            }
        }
        if (x - 1 >= 0) {
            if (this.grid[y][x - 1].letterObject.char !== EMPTY_CHAR) {
                return true;
            }
        }
        if (y + 1 < BOARD_DIMENSION) {
            if (this.grid[y + 1][x].letterObject.char !== EMPTY_CHAR) {
                return true;
            }
        }
        if (y - 1 >= 0) {
            if (this.grid[y - 1][x].letterObject.char !== EMPTY_CHAR) {
                return true;
            }
        }
        return false;
    }

    private initGrid(randomBonus: boolean) {
        this.grid = [];
        for (let i = 0; i < BOARD_DIMENSION; i++) {
            this.grid[i] = [];
            for (let j = 0; j < BOARD_DIMENSION; j++) {
                this.grid[i][j] = new Tile();
                this.grid[i][j].letterObject = { char: EMPTY_CHAR, value: 1 };
            }
        }
        this.generateMultiplicators(randomBonus);
    }

    private randomMultiplicators(): BoardSettingPosition[] {
        const newMultiplicators: BoardSettingPosition[] = [];
        const values: number[] = [];
        for (const multiplicator of MULTIPLICATORS) {
            newMultiplicators.push({ ...multiplicator });
            values.push(multiplicator.v);
        }
        for (const element of newMultiplicators) {
            const newValueIndex = Math.floor(Math.random() * values.length);
            element.v = values[newValueIndex];
            values.splice(newValueIndex, 1);
        }
        return newMultiplicators;
    }

    private generateMultiplicators(randomBonus: boolean): void {
        let listMultiplicator = MULTIPLICATORS;
        if (randomBonus) {
            listMultiplicator = this.randomMultiplicators();
            while (listMultiplicator === MULTIPLICATORS) {
                listMultiplicator = this.randomMultiplicators();
            }
        }
        for (const elem of listMultiplicator) {
            const tile = this.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE];
            if (elem.type === MultiType.Letter) {
                tile.letterMultiplicator = elem.v;
            } else {
                tile.wordMultiplicator = elem.v;
            }
        }
    }
}
