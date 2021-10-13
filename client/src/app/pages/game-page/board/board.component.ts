import { AfterViewInit, Component, DoCheck, ElementRef, IterableDiffers, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ASCII_CODE } from '@app/GameLogic/constants';
import { Board } from '@app/GameLogic/game/board/board';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { CanvasDrawer } from '@app/pages/game-page/board/canvas-drawer';

const MAX_FONT_SIZE = 14;
const MIN_FONT_SIZE = 7;

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit, DoCheck {
    @ViewChild('ScrabbleBoard') scrabbleBoard: ElementRef;
    @ViewChild('gridCanvas') private canvas!: ElementRef<HTMLCanvasElement>;
    board: Board;
    minFontSize = MIN_FONT_SIZE;
    maxFontSize = MAX_FONT_SIZE;
    fontSize: number;
    canvasDrawer: CanvasDrawer;

    constructor(private boardService: BoardService, private itDiffer: IterableDiffers) {
        this.board = this.boardService.board;
        this.fontSize = (this.minFontSize + this.maxFontSize) / 2;
    }
    ngAfterViewInit() {
        (this.scrabbleBoard.nativeElement as HTMLParagraphElement).style.fontSize = `${this.fontSize}px`;
        const canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const canvasElement = document.getElementById('canvas');
        if (canvasElement) {
            canvasElement.setAttribute('width', canvasElement.clientWidth.toString());
            canvasElement.setAttribute('height', canvasElement.clientWidth.toString());

            this.canvasDrawer = new CanvasDrawer(canvasContext, canvasElement.clientWidth, canvasElement.clientHeight);
        }
        this.canvasDrawer.drawGrid(this.board);
    }

    ngDoCheck() {
        const changes = this.itDiffer.find([]).create(undefined).diff(this.board.grid);
        if (changes && this.canvasDrawer) {
            this.canvasDrawer.drawGrid(this.board);
        }
    }

    getFont(): string {
        return `font-size: ${this.fontSize}px;`;
    }

    convertASCIIToChar(code: number): string {
        return String.fromCharCode(ASCII_CODE + code);
    }

    updateSetting(event: MatSliderChange) {
        if (event.value != null) {
            this.fontSize = event.value;
            (this.scrabbleBoard.nativeElement as HTMLParagraphElement).style.fontSize = `${this.fontSize}px`;
        }
    }
}
