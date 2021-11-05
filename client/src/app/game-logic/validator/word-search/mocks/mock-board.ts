import { EMPTY_CHAR } from '@app/game-logic/constants';
import { Board } from '@app/game-logic/game/board/board';
import { Tile } from '@app/game-logic/game/board/tile';

const BOARD_LENGTH = 10;
const BOARD_WIDTH = 10;

export class MockBoard extends Board {
    grid: Tile[][];
    constructor() {
        super();
        this.grid = [];
        for (let i = 0; i < BOARD_WIDTH; i++) {
            this.grid[i] = [];
            for (let j = 0; j < BOARD_LENGTH; j++) {
                this.grid[i][j] = new Tile();
                this.grid[i][j].letterObject = { char: EMPTY_CHAR, value: 1 };
            }
        }
        this.grid[0][4].letterObject = { char: 'O', value: 1 };
        this.grid[0][5].letterObject = { char: 'N', value: 1 };
        this.grid[1][3].letterObject = { char: 'O', value: 1 };
        this.grid[0][6].letterObject = { char: 'N', value: 1 };
    }
}
