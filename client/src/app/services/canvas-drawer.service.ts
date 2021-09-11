import { Injectable } from '@angular/core';
import { Board } from '@app/classes/board';
const NUM_TILE_FAKE = 16;
const NUM_TILE = 15;
const paddingValue = 0.004;
const asciiStartPos = 65;
const pourcentageOffset = 0.75;
@Injectable({
    providedIn: 'root',
})

// TODO revoir le fontSize pour la valeur de la lettre
export class CanvasDrawerService {
    private gridContext: CanvasRenderingContext2D;
    private board: Board;

    private canvasPadding: number;
    private widthLenght: number;
    private tempWidth: number;
    private padding: number;
    private tileWidth: number;
    private yOffset: number;
    private fontSize: number;

    update(board: Board): void {
        this.board = board;
        this.clear();
        this.draw();
    }

    setCanvasRef(context: CanvasRenderingContext2D): void {
        this.gridContext = context;
    }

    private draw(): void {
        this.fitToContainer();
        this.drawLetters(this.padding, this.tileWidth);

        for (let i = 0; i < NUM_TILE; i++) {
            for (let j = 0; j < NUM_TILE; j++) {
                this.fillColor(i, j);
                this.drawBoxs(i, j);
            }
        }
    }

    private clear(): void {
        this.gridContext.clearRect(0, 0, this.gridContext.canvas.width, this.gridContext.canvas.height);
    }

    private fitToContainer(): void {
        this.gridContext.canvas.width = this.gridContext.canvas.offsetWidth;
        this.gridContext.canvas.height = this.gridContext.canvas.offsetHeight;
        this.widthLenght = this.gridContext.canvas.width;

        this.tempWidth = this.widthLenght / NUM_TILE_FAKE;
        this.padding = paddingValue * this.widthLenght;
        this.tileWidth = this.tempWidth - 2 * this.padding;
        this.canvasPadding = this.tileWidth + 2 * this.padding;

        this.widthLenght -= this.canvasPadding;

        this.fontSize = this.calculateMaxFontSize(this.tileWidth);
    }

    private calculateMaxFontSize(padding: number): number {
        let i = 0;
        let prevWidth = 0;
        let width = 0;
        while (width < padding) {
            prevWidth = width;
            this.gridContext.font = `${i}px Verdana`;
            width = this.gridContext.measureText('AA').width;
            i++;
        }
        this.yOffset = prevWidth;
        return i;
    }

    private drawLetters(padding: number, tileWidth: number): void {
        this.gridContext.font = `${this.fontSize}px Verdana`;
        for (let i = 0; i < NUM_TILE; i++) {
            const value = (i + 1).toString();
            this.gridContext.fillText(value, this.canvasPadding + 2 * i * padding + i * tileWidth + padding, this.canvasPadding);
        }

        for (let i = 0; i < NUM_TILE; i++) {
            this.gridContext.fillText(
                String.fromCharCode(asciiStartPos + i),
                padding,
                this.tileWidth + this.canvasPadding + 2 * i * padding + i * tileWidth,
            );
        }
    }

    private drawBoxs(i: number, j: number): void {
        const xPos = i * this.tempWidth + this.padding + this.canvasPadding;
        const yPos = j * this.tempWidth + this.padding + this.canvasPadding;

        this.gridContext.fillRect(xPos, yPos, this.tileWidth, this.tileWidth);
        this.gridContext.fillStyle = 'black';
        this.gridContext.fillText(this.board.grid[i][j].letter, xPos, yPos + this.calculateMaxFontSize(this.tileWidth));
        this.gridContext.font = `${this.fontSize}px Verdana`;
        const tileValue = this.board.grid[i][j].letter === '' ? '' : this.board.grid[i][j].value;
        this.gridContext.fillText(tileValue.toString(), xPos + this.tileWidth * pourcentageOffset, yPos + this.yOffset);
    }

    private fillColor(i: number, j: number): void {
        switch (this.board.grid[i][j].letterMultiplicator) {
            case 1:
                this.gridContext.fillStyle = 'rgb(200, 200, 204)';
                break;
            case 2:
                this.gridContext.fillStyle = 'rgb(102, 153, 255)';
                break;
            case 3:
                this.gridContext.fillStyle = 'rgb(0, 0, 204)';
                break;
        }
        switch (this.board.grid[i][j].wordMultiplicator) {
            case 2:
                this.gridContext.fillStyle = 'rgb(255, 102, 102)';
                break;
            case 3:
                this.gridContext.fillStyle = 'rgb(255, 0, 0)';
                break;
        }
    }
}
