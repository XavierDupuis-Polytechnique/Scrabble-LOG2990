import { BOARD_DIMENSION, EMPTY_CHAR } from '@app/GameLogic/constants';
import { Tile } from './tile';
export const ASCII_CODE = 65;
interface BoardSettingPosition {
    x: number;
    y: string;
    v: number;
}

export const wordMultiplicator: BoardSettingPosition[] = [
    { x: 1, y: 'A', v: 3 },
    { x: 8, y: 'A', v: 3 },
    { x: 15, y: 'A', v: 3 },

    { x: 2, y: 'B', v: 2 },
    { x: 14, y: 'B', v: 2 },

    { x: 3, y: 'C', v: 2 },
    { x: 13, y: 'C', v: 2 },

    { x: 4, y: 'D', v: 2 },
    { x: 12, y: 'D', v: 2 },

    { x: 5, y: 'E', v: 2 },
    { x: 11, y: 'E', v: 2 },

    { x: 1, y: 'H', v: 3 },
    { x: 8, y: 'H', v: 2 },
    { x: 15, y: 'H', v: 3 },

    { x: 5, y: 'K', v: 2 },
    { x: 11, y: 'K', v: 2 },

    { x: 4, y: 'L', v: 2 },
    { x: 12, y: 'L', v: 2 },

    { x: 3, y: 'M', v: 2 },
    { x: 13, y: 'M', v: 2 },

    { x: 2, y: 'N', v: 2 },
    { x: 14, y: 'N', v: 2 },

    { x: 1, y: 'O', v: 3 },
    { x: 8, y: 'O', v: 3 },
    { x: 15, y: 'O', v: 3 },
];

export const letterMultiplicator: BoardSettingPosition[] = [
    { x: 4, y: 'A', v: 2 },
    { x: 12, y: 'A', v: 2 },

    { x: 6, y: 'B', v: 3 },
    { x: 10, y: 'B', v: 3 },

    { x: 7, y: 'C', v: 2 },
    { x: 9, y: 'C', v: 2 },

    { x: 1, y: 'D', v: 2 },
    { x: 8, y: 'D', v: 2 },
    { x: 15, y: 'D', v: 2 },

    { x: 2, y: 'F', v: 3 },
    { x: 6, y: 'F', v: 3 },
    { x: 10, y: 'F', v: 3 },
    { x: 14, y: 'F', v: 3 },

    { x: 3, y: 'G', v: 2 },
    { x: 7, y: 'G', v: 2 },
    { x: 9, y: 'G', v: 2 },
    { x: 13, y: 'G', v: 2 },

    { x: 4, y: 'H', v: 2 },
    { x: 12, y: 'H', v: 2 },

    { x: 3, y: 'I', v: 2 },
    { x: 7, y: 'I', v: 2 },
    { x: 9, y: 'I', v: 2 },
    { x: 13, y: 'I', v: 2 },

    { x: 2, y: 'J', v: 3 },
    { x: 6, y: 'J', v: 3 },
    { x: 10, y: 'J', v: 3 },
    { x: 14, y: 'J', v: 3 },

    { x: 1, y: 'L', v: 2 },
    { x: 8, y: 'L', v: 2 },
    { x: 15, y: 'L', v: 2 },

    { x: 7, y: 'M', v: 2 },
    { x: 9, y: 'M', v: 2 },

    { x: 6, y: 'N', v: 3 },
    { x: 10, y: 'N', v: 3 },

    { x: 4, y: 'O', v: 2 },
    { x: 12, y: 'O', v: 2 },
];
export class Board {
    grid: Tile[][];
    constructor() {
        this.grid = [];
        for (let i = 0; i < BOARD_DIMENSION; i++) {
            this.grid[i] = [];
            for (let j = 0; j < BOARD_DIMENSION; j++) {
                this.grid[i][j] = new Tile();
                this.grid[i][j].letterObject = { char: EMPTY_CHAR, value: 1 };
            }
        }

        wordMultiplicator.forEach((elem) => {
            this.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].wordMultiplicator = elem.v;
        });

        letterMultiplicator.forEach((elem) => {
            this.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].letterMultiplicator = elem.v;
        });
    }
    desactivateLetterMultiplicator(x: number, y: number) {
        this.grid[y][x].letterMultiplicator = 1;
    }

    desactivateWordMultiplicator(x: number, y: number) {
        this.grid[y][x].wordMultiplicator = 1;
    }
}
