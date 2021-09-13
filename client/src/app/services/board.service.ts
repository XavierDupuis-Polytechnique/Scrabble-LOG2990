import { Injectable } from '@angular/core';
import { Board } from '@app/classes/board';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    board: Board = new Board();
}
