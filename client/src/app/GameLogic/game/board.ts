import { Tile } from './tile';
const NUM_TILES = 15;
export class Board {
    grid: Tile[][];

    constructor() {
        this.grid = [];
        for (let i = 0; i < NUM_TILES; i++) {
            this.grid[i] = [];
            for (let j = 0; j < NUM_TILES; j++) {
                this.grid[i][j] = new Tile();
            }
        }
    }
}
