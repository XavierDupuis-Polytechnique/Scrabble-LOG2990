import { Component } from '@angular/core';
import { Board } from '@app/classes/board';
import { BoardService } from '@app/services/board.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    board: Board;

    constructor(private boardService: BoardService) {
        this.board = this.boardService.board;
        this.boardService.board.grid[0][0].letterMultiplicator = 2;
        this.boardService.board.grid[0][0].letter = 'A';
    }
}
