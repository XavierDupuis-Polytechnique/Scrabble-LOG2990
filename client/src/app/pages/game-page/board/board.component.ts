import { Component } from '@angular/core';
import { Board } from '@app/GameLogic/game/board';
import { BoardService } from '@app/services/board.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    board: Board;
    fontSize: number = 24;

    constructor(private boardService: BoardService) {
        this.board = this.boardService.board;
    }

    increaseFont(): void {
        if (this.fontSize <= 24) {
            this.fontSize += 1;
        }
    }

    decreaseFont(): void {
        if (this.fontSize >= 10) {
            this.fontSize -= 1;
        }
    }

    getFont(): string {
        return `font-size: ${this.fontSize}px;`;
    }
}
