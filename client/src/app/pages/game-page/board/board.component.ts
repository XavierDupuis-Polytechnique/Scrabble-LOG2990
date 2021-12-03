import { AfterViewInit, Component, DoCheck, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { UIInputControllerService } from '@app/game-logic/actions/ui-actions/ui-input-controller.service';
import { UIPlace } from '@app/game-logic/actions/ui-actions/ui-place';
import { ASCII_CODE, NOT_FOUND } from '@app/game-logic/constants';
import { Board } from '@app/game-logic/game/board/board';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { InputComponent, InputType, UIInput } from '@app/game-logic/interfaces/ui-input';
import { CanvasDrawer } from '@app/pages/game-page/board/canvas-drawer';

const MAX_FONT_SIZE = 22;
const MIN_FONT_SIZE = 14;

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit, DoCheck {
    @ViewChild('ScrabbleBoard') scrabbleBoard: ElementRef;
    @Output() clickTile = new EventEmitter();
    @ViewChild('gridCanvas') private canvas!: ElementRef<HTMLCanvasElement>;
    readonly self = InputComponent.Board;
    board: Board;
    minFontSize = MIN_FONT_SIZE;
    maxFontSize = MAX_FONT_SIZE;
    fontSize: number;
    canvasDrawer: CanvasDrawer;
    canvasContext: CanvasRenderingContext2D;
    canvasElement: HTMLElement | null;

    constructor(private boardService: BoardService, private inputController: UIInputControllerService) {
        this.board = this.boardService.board;
        this.fontSize = (this.minFontSize + this.maxFontSize) / 2;
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.setupCanvasDrawer();
    }

    ngAfterViewInit() {
        (this.scrabbleBoard.nativeElement as HTMLParagraphElement).style.fontSize = `${this.fontSize}px`;
        this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasElement = document.getElementById('canvas');
        if (this.canvasElement) {
            this.setupCanvasDrawer();
        }
        this.canvasDrawer.drawGrid(this.board, this.fontSize);
    }

    ngDoCheck() {
        if (!this.canvasDrawer) {
            return;
        }
        if (this.inputController.activeAction instanceof UIPlace) {
            if (this.inputController.activeAction.pointerPosition) {
                this.canvasDrawer.setIndicator(
                    this.inputController.activeAction.pointerPosition.x,
                    this.inputController.activeAction.pointerPosition.y,
                );
                this.canvasDrawer.setDirection(this.inputController.activeAction.direction);
            }
        } else {
            this.canvasDrawer.setIndicator(NOT_FOUND, NOT_FOUND);
        }
        this.canvasDrawer.drawGrid(this.board, this.fontSize);
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

    canvasClick(event: MouseEvent): void {
        const pos = this.canvasDrawer.coordToTilePosition(event.offsetX, event.offsetY);
        const input: UIInput = { from: this.self, type: InputType.LeftClick, args: { x: pos.indexI, y: pos.indexJ } };
        this.clickTile.emit(input);
    }

    private setupCanvasDrawer() {
        if (this.canvasElement) {
            this.canvasElement.setAttribute('width', this.canvasElement.clientWidth.toString());
            this.canvasElement.setAttribute('height', this.canvasElement.clientWidth.toString());
            this.canvasDrawer = new CanvasDrawer(this.canvasContext, this.canvasElement.clientWidth, this.canvasElement.clientHeight);
        }
    }
}
