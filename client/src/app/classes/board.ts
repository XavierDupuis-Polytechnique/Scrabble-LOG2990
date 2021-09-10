import { newTile, Tile } from './tile';

export const GRID_CELL_NUMBER = 15;

export class Board {
    grid: Tile[][];

    constructor() {
        this.grid = [];
        for (let i = 0; i < GRID_CELL_NUMBER; i++) {
            this.grid[i] = [];
            for (let j = 0; j < GRID_CELL_NUMBER; j++) {
                this.grid[i][j] = newTile();
            }
        }
    }

    getTile(i: number, j: number): Tile {
        return this.grid[i][j];
    }

    setTile(i: number, j: number, tile: Tile): void {
        this.grid[i][j] = tile;
    }
}
