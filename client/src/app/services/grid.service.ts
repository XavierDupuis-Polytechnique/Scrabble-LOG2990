import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;
export const NUMBER_GRID_CELL = 15;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    // Remove later
    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;

        this.gridContext.moveTo((this.width * 3) / 10, (this.height * 4) / 10);
        this.gridContext.lineTo((this.width * 7) / 10, (this.height * 4) / 10);

        this.gridContext.moveTo((this.width * 3) / 10, (this.height * 6) / 10);
        this.gridContext.lineTo((this.width * 7) / 10, (this.height * 6) / 10);

        this.gridContext.moveTo((this.width * 4) / 10, (this.height * 3) / 10);
        this.gridContext.lineTo((this.width * 4) / 10, (this.height * 7) / 10);

        this.gridContext.moveTo((this.width * 6) / 10, (this.height * 3) / 10);
        this.gridContext.lineTo((this.width * 6) / 10, (this.height * 7) / 10);

        this.gridContext.stroke();
    }

    drawBoard(witdh: number, height: number) {
        const step = witdh / NUMBER_GRID_CELL;
        // size of canvas
        for (let x = 0; x <= witdh; x += step) {
            this.gridContext.moveTo(0.5 + x, 0);
            this.gridContext.lineTo(0.5 + x, height);
        }

        for (let x = 0; x <= height; x += step) {
            this.gridContext.moveTo(0, 0.5 + x);
            this.gridContext.lineTo(witdh, 0.5 + x);
        }

        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;
        this.gridContext.stroke();
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
}
