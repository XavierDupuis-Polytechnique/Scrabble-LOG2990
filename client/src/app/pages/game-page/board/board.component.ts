import { Component, ElementRef, ViewChild } from '@angular/core';
import { ASCII_CODE, Board } from '@app/GameLogic/game/board';
import { BoardService } from '@app/services/board.service';

const DEFAULT_FONT_SIZE = 17;
const MAX_FONT_SIZE = 24;
const MIN_FONT_SIZE = 10;
@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    @ViewChild('ScrabbleBoard') scrabbleBoard: ElementRef;
    board: Board;
    fontSize: number = DEFAULT_FONT_SIZE;

    constructor(private boardService: BoardService) {
        this.board = this.boardService.board;
    }

    increaseFont(): void {
        if (this.fontSize <= MAX_FONT_SIZE) {
            this.fontSize += 1;
            (this.scrabbleBoard.nativeElement as HTMLParagraphElement).style.fontSize = `${this.fontSize}px`;
        }
    }

    decreaseFont(): void {
        if (this.fontSize >= MIN_FONT_SIZE) {
            this.fontSize -= 1;
            (this.scrabbleBoard.nativeElement as HTMLParagraphElement).style.fontSize = `${this.fontSize}px`;
        }
    }

    getFont(): string {
        return `font-size: ${this.fontSize}px;`;
    }

    convertASCIIToChar(code: number): string {
        return String.fromCharCode(ASCII_CODE + code);
    }
}
