import { Injectable } from '@angular/core';
import { Board, EMPTY_CHAR, NUM_TILES } from '@app/GameLogic/game/board';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    board: Board = new Board();

    hasNeighbour(x: number, y: number): boolean {
        if (x + 1 < NUM_TILES) {
            if (this.board.grid[y][x + 1].letterObject.char !== EMPTY_CHAR) {
                return true;
            }
        }
        if (x - 1 >= 0) {
            if (this.board.grid[y][x - 1].letterObject.char !== EMPTY_CHAR) {
                return true;
            }
        }
        if (y + 1 < NUM_TILES) {
            if (this.board.grid[y + 1][x].letterObject.char !== EMPTY_CHAR) {
                return true;
            }
        }
        if (y - 1 >= 0) {
            if (this.board.grid[y - 1][x].letterObject.char !== EMPTY_CHAR) {
                return true;
            }
        }
        return false;
    }
}
