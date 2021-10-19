import { Board } from '@app/GameLogic/game/board/board';

/* eslint-disable @typescript-eslint/no-magic-numbers */
interface Vec2 {
    x: number;
    y: number;
}

enum BonusType {
    LetterBonus,
    WordBonus,
}

export class CanvasDrawer {
    canvas: CanvasRenderingContext2D;
    width: number;
    height: number;
    fontSize = 20;
    private tileSize: number;
    private scale: number = 0.5;
    private offset: number = 50;
    private font = 'Arial';

    constructor(canvasContext: CanvasRenderingContext2D, w: number, h: number) {
        this.canvas = canvasContext;
        this.canvas.lineWidth = 1;
        this.width = w;
        this.height = h;
        this.canvas.lineWidth = 1;
        this.tileSize = (this.width - this.offset - this.canvas.lineWidth * 16) / 15;
    }
    drawGrid(board: Board): void {
        this.canvas.clearRect(0, 0, this.width, this.height);
        this.canvas.fillStyle = '#FFFFFF';
        this.canvas.fillRect(0, 0, this.width, this.height);
        this.canvas.fillStyle = '#000000';
        this.canvas.font = `${this.fontSize}px ${this.font}`;

        for (let i = 0; i < 16; i++) {
            this.drawRow(i);
            this.drawColumn(i);
        }
        this.drawColumnIdentifier();
        this.drawRowIdentifier();

        for (let i = 0; i < board.grid.length; i++) {
            for (let j = 0; j < board.grid.length; j++) {
                if (board.grid[i][j].letterMultiplicator !== 1) {
                    this.drawBonus(i, j, BonusType.LetterBonus, board.grid[i][j].letterMultiplicator);
                } else if (board.grid[i][j].wordMultiplicator !== 1) {
                    this.drawBonus(i, j, BonusType.WordBonus, board.grid[i][j].wordMultiplicator);
                } else if (board.grid[i][j].letterObject.char !== ' ') {
                    this.drawTile(board.grid[i][j].letterObject.char, board.grid[i][j].letterObject.value, i, j);
                }
            }
        }
    }

    checkFontSize(fontSize: number): boolean {
        this.canvas.font = `${fontSize}px ${this.font}`;
        const temp1 = this.canvas.measureText('W').width;
        this.canvas.font = `${fontSize * this.scale}px ${this.font}`;
        const temp2 = this.canvas.measureText('10').width;
        const width = temp1 + temp2;
        if (width > this.tileSize) {
            return false;
        } else {
            return true;
        }
    }

    coordToTilePosition(x: number, y: number) {
        const i = Math.floor((x - this.canvas.lineWidth - this.offset) / (this.tileSize + this.canvas.lineWidth));
        const j = Math.floor((y - this.canvas.lineWidth - this.offset) / (this.tileSize + this.canvas.lineWidth));

        return { indexI: i, indexJ: j };
    }

    private tilePositionToCoord(i: number, j: number): Vec2 {
        const x = i * this.tileSize + (i + 1) * this.canvas.lineWidth;
        const y = j * this.tileSize + (j + 1) * this.canvas.lineWidth;
        return { x: x + this.offset, y: y + this.offset };
    }

    private drawRow(i: number) {
        const offset = i * (this.canvas.lineWidth + this.tileSize) + this.offset;
        this.canvas.beginPath();
        this.canvas.moveTo(this.offset, offset);
        this.canvas.lineTo(this.width, offset);
        this.canvas.stroke();
    }

    private drawColumn(i: number) {
        const offset = i * (this.canvas.lineWidth + this.tileSize) + this.offset;
        this.canvas.beginPath();
        this.canvas.moveTo(offset, this.offset);
        this.canvas.lineTo(offset, this.height);
        this.canvas.stroke();
    }
    private drawTile(letter: string, value: number, i: number, j: number) {
        this.canvas.font = `${this.fontSize}px ${this.font}`;
        this.canvas.fillStyle = '#000000';

        this.canvas.textAlign = 'start';
        this.canvas.textBaseline = 'alphabetic';
        const letterWidth = this.canvas.measureText(letter).width;
        this.canvas.font = `${this.fontSize * this.scale}px ${this.font}`;
        const valueWidth = this.canvas.measureText(value.toString()).width;
        const tileWidth = letterWidth + valueWidth;

        const offset = (this.tileSize - tileWidth) / 2;
        this.canvas.font = `${this.fontSize}px ${this.font}`;
        const pos = this.tilePositionToCoord(i, j);
        pos.x += offset;
        pos.y += this.tileSize * 0.7;
        this.canvas.textBaseline = 'bottom';
        this.canvas.fillText(letter, pos.x, pos.y);

        this.canvas.font = `${this.fontSize * this.scale}px ${this.font}`;
        pos.x += letterWidth;
        this.canvas.textBaseline = 'top';
        this.canvas.fillText(value.toString(), pos.x, pos.y);
    }

    private drawColumnIdentifier() {
        this.canvas.font = `${this.fontSize}px ${this.font}`;
        this.canvas.fillStyle = '#000000';

        for (let i = 0; i < 15; i++) {
            const letter = String.fromCharCode(i + 65);
            const offset = i * (this.canvas.lineWidth + this.tileSize) + this.offset + this.tileSize / 3;
            this.canvas.textBaseline = 'top';
            this.canvas.textAlign = 'center';
            this.canvas.fillText(letter, 20, offset);
        }
    }

    private drawRowIdentifier() {
        this.canvas.font = `${this.fontSize}px ${this.font}`;
        this.canvas.fillStyle = '#000000';

        for (let i = 0; i < 15; i++) {
            const offset = i * (this.canvas.lineWidth + this.tileSize) + this.offset + this.tileSize / 2;
            this.canvas.textBaseline = 'top';
            this.canvas.textAlign = 'center';
            this.canvas.fillText((i + 1).toString(), offset, 20);
        }
    }
    private drawBonus(i: number, j: number, type: BonusType, mul: number) {
        this.canvas.font = `${this.fontSize * this.scale}px ${this.font}`;
        this.canvas.textAlign = 'start';
        let s = '';
        const pos = this.tilePositionToCoord(i, j);

        if (type === BonusType.LetterBonus) {
            s = 'Lettre';
            if (mul === 2) {
                this.canvas.fillStyle = '#78D1DD';
            } else if (mul === 3) {
                this.canvas.fillStyle = '#3257BB';
            }
        } else {
            s = 'Mot';
            if (mul === 2) {
                this.canvas.fillStyle = '#F88E8E';
            } else if (mul === 3) {
                this.canvas.fillStyle = '#D1002D';
            }
        }
        this.canvas.fillRect(pos.x, pos.y, this.tileSize - this.canvas.lineWidth, this.tileSize - this.canvas.lineWidth);
        this.canvas.fillStyle = '#FFFFFF';
        this.canvas.fillText(s, pos.x, pos.y);
        this.canvas.fillText(`X${mul}`, pos.x, pos.y + this.tileSize / 2);
    }
}
