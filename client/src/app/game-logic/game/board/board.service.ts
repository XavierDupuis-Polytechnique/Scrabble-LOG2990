import { Injectable } from '@angular/core';
import { Board } from '@app/game-logic/game/board/board';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    board: Board = new Board(false);
}
