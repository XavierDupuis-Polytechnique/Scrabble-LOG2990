import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GridService } from '@app/services/grid.service';

export const BOARD_WIDTH = 500;
export const BOARD_HEIGTH = 500;

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit, OnInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    constructor(private readonly gridService: GridService) {}

    ngOnInit(): void {
        const gridElement = document.getElementById('gridContainer');
        if (gridElement?.clientHeight !== undefined && gridElement.clientWidth !== undefined) {
            this.gridService.containerHeight = gridElement.clientHeight;
            this.gridService.containerWidth = gridElement.clientWidth;
        }
    }
    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawBoard();
    }

    get width(): number {
        return this.gridService.containerWidth;
    }

    get height(): number {
        return this.gridService.containerHeight;
    }
}
