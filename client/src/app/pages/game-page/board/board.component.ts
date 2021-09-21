import { Component, ElementRef, ViewChild } from '@angular/core';
import { ASCII_CODE, Board } from '@app/GameLogic/game/board';
import { BoardService } from '@app/services/board.service';

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
    minFontSize = MIN_FONT_SIZE;
    maxFontSize = MAX_FONT_SIZE;
    fontSize: number = this.maxFontSize;

    constructor(private boardService: BoardService) {
        this.board = this.boardService.board;
    }

    increaseFont(): void {
        if (this.fontSize <= this.maxFontSize) {
            this.fontSize += 1;
            (this.scrabbleBoard.nativeElement as HTMLParagraphElement).style.fontSize = `${this.fontSize}px`;
        }
    }

    decreaseFont(): void {
        if (this.fontSize >= this.minFontSize) {
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
