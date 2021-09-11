import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Board } from '@app/classes/board';
import { CanvasDrawerService } from '@app/services/canvas-drawer.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit {
    @ViewChild('myCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;

    constructor(private readonly canvasDrawerService: CanvasDrawerService) {}

    ngAfterViewInit(): void {
        this.canvasDrawerService.setCanvasRef(this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        const test = new Board();
        test.grid[0][0].letter = 'A';
        test.grid[0][0].value = 0;
        this.canvasDrawerService.update(test);
    }
}
