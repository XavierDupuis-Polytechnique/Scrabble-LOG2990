import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GridService } from '@app/services/grid.service';

export const BOARD_WIDTH = 500;
export const BOARD_HEIGTH = 500;

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;

    constructor(private readonly gridService: GridService) {}

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawBoard(this.width, this.height);
    }

    get width(): number {
        return BOARD_WIDTH;
    }

    get height(): number {
        return BOARD_HEIGTH;
    }
}
