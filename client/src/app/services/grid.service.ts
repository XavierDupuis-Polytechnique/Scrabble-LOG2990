import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;
export const NUMBER_GRID_CELL = 15;
export const PADDING = 100;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;

    containerHeight: number;
    containerWidth: number;

    maxGridSize: number;

    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    // Remove later
    drawGrid() {
        this.calculateMinMax();
        this.maxGridSize -= 2 * PADDING;
        const step = this.maxGridSize / NUMBER_GRID_CELL;

        for (let x = 0; x <= this.maxGridSize; x += step) {
            this.gridContext.moveTo(0.5 + x + PADDING, PADDING);
            this.gridContext.lineTo(0.5 + x + PADDING, this.maxGridSize + PADDING);
        }

        for (let x = 0; x <= this.maxGridSize; x += step) {
            this.gridContext.moveTo(PADDING, 0.5 + x + PADDING);
            this.gridContext.lineTo(this.maxGridSize + PADDING, 0.5 + x + PADDING);
            this.gridContext.stroke();
        }

        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 2;
        this.gridContext.stroke();
    }

    drawIndicator() {
        this.gridContext.font = '10px Arial';
        const step = this.maxGridSize / NUMBER_GRID_CELL;
        for (let x = 0, s = PADDING; x < NUMBER_GRID_CELL; x++, s += step) {
            this.gridContext.fillText(String.fromCharCode(65 + x), s, PADDING);
        }
        // Why not working
        for (let x = 0, s = PADDING; x < NUMBER_GRID_CELL; x++, s += step) {
            this.gridContext.fillText(x.toString(), 0, s);
        }
    }

    drawBoard() {
        this.drawGrid();
        this.drawIndicator();
    }

    drawWord(word: string) {
        const startPosition: Vec2 = { x: 175, y: 100 };
        const step = 20;
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }
    // Remove later
    get width(): number {
        return this.canvasSize.x;
    }
    // Remove later
    get height(): number {
        return this.canvasSize.y;
    }

    calculateMinMax(): void {
        this.maxGridSize = this.containerHeight < this.containerWidth ? this.containerHeight : this.containerWidth;
    }
}
