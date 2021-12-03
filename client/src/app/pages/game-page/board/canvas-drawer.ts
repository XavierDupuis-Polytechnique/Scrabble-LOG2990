/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Direction } from '@app/game-logic/direction.enum';
import { Board } from '@app/game-logic/game/board/board';
import { Vec2 } from '@app/game-logic/interfaces/vec2';
import {
    BACKGROUND_COLOR,
    BLACK_LINE,
    BONUS_TEXT_COLOR,
    BORDER_COLOR,
    BORDER_TEMP_TILE,
    DOUBLE_BONUS_LETTER,
    DOUBLE_BONUS_WORD,
    IDENTIFIER_COLOR,
    INDICATOR_COLOR,
    TILE_COLOR,
    TRIPLE_BONUS_LETTER,
    TRIPLE_BONUS_WORD,
} from '@app/pages/game-page/board/canvas-colors';

enum BonusType {
    LetterBonus,
    WordBonus,
}
export class CanvasDrawer {
    fontSize = 20;
    private tileSize: number;
    private scale: number = 0.5;
    private offset: number;
    private font = 'Helvetica';
    private borderWidth: number = 8;

    private indicatorPos: Vec2 = { x: -1, y: -1 };
    private indicatorDir: Direction;

    constructor(public canvas: CanvasRenderingContext2D, public width: number, public height: number) {
        this.canvas.lineWidth = 1;
        this.tileSize = (this.width - 2 * this.borderWidth - this.canvas.lineWidth * 17) / 16;
        this.offset = this.tileSize + this.borderWidth;
    }

    drawGrid(board: Board, fontsize: number): void {
        this.canvas.clearRect(0, 0, this.width, this.height);
        this.canvas.globalAlpha = 0.9;
        this.canvas.fillStyle = BACKGROUND_COLOR;
        this.canvas.fillRect(
            this.borderWidth,
            this.borderWidth,
            this.width - 2 * this.borderWidth,
            this.height - 2 * this.borderWidth - this.canvas.lineWidth,
        );
        this.canvas.globalAlpha = 1;
        this.fontSize = fontsize;
        this.canvas.font = `${this.fontSize}px ${this.font}`;
        for (let i = 1; i < 17; i++) {
            this.drawRow(i);
            this.drawColumn(i);
        }
        this.drawColumnIdentifier();
        this.drawRowIdentifier();

        for (let i = 0; i < board.grid.length; i++) {
            for (let j = 0; j < board.grid.length; j++) {
                if (board.grid[i][j].letterObject.char !== ' ') {
                    this.drawTile(board.grid[i][j].letterObject.char, board.grid[i][j].letterObject.value, i, j);
                    if (board.grid[i][j].letterObject.isTemp) {
                        this.drawHighlight(j, i);
                    }
                } else if (board.grid[i][j].letterMultiplicator !== 1) {
                    this.drawBonus({ x: j, y: i }, BonusType.LetterBonus, board.grid[i][j].letterMultiplicator);
                } else if (board.grid[i][j].wordMultiplicator !== 1) {
                    this.drawBonus({ x: j, y: i }, BonusType.WordBonus, board.grid[i][j].wordMultiplicator);
                }
            }
        }

        if (this.indicatorPos.x !== -1 && this.indicatorPos.y !== -1 && this.indicatorDir) {
            if (board.grid[this.indicatorPos.y][this.indicatorPos.x].letterObject.char === ' ') {
                this.drawIndicator();
            }
        }
        this.drawborder();
    }

    coordToTilePosition(x: number, y: number) {
        const indexI = Math.floor((x - this.canvas.lineWidth - this.offset) / (this.tileSize + this.canvas.lineWidth));
        const indexJ = Math.floor((y - this.canvas.lineWidth - this.offset) / (this.tileSize + this.canvas.lineWidth));
        return { indexI, indexJ };
    }

    setIndicator(i: number, j: number) {
        this.indicatorPos = { x: i, y: j };
    }

    setDirection(dir: Direction) {
        this.indicatorDir = dir;
    }

    private tilePositionToCoord(i: number, j: number): Vec2 {
        const x = i * this.tileSize + (i + 1) * this.canvas.lineWidth;
        const y = j * this.tileSize + (j + 1) * this.canvas.lineWidth;
        return { x: x + this.offset, y: y + this.offset };
    }

    private drawRow(i: number) {
        const offset = i * (this.canvas.lineWidth + this.tileSize) + this.borderWidth;
        this.canvas.fillStyle = BLACK_LINE;
        const widthSize = this.width - 2 * this.borderWidth - this.tileSize - this.canvas.lineWidth;
        this.canvas.fillRect(this.borderWidth + this.tileSize + this.canvas.lineWidth, offset, widthSize, this.canvas.lineWidth);
    }

    private drawColumn(i: number) {
        const offset = i * (this.canvas.lineWidth + this.tileSize) + this.borderWidth;
        this.canvas.fillStyle = BLACK_LINE;
        const heightSize = this.height - 2 * this.borderWidth - this.tileSize - this.canvas.lineWidth;
        this.canvas.fillRect(offset, this.borderWidth + this.tileSize + this.canvas.lineWidth, this.canvas.lineWidth, heightSize);
    }

    private drawTile(letter: string, value: number, i: number, j: number) {
        const pos = this.tilePositionToCoord(j, i);
        this.canvas.fillStyle = TILE_COLOR;
        this.canvas.fillRect(
            pos.x + 2 * this.canvas.lineWidth,
            pos.y + 2 * this.canvas.lineWidth,
            this.tileSize - 2 * this.canvas.lineWidth,
            this.tileSize - 2 * this.canvas.lineWidth,
        );
        this.canvas.strokeStyle = BLACK_LINE;
        this.canvas.strokeRect(
            pos.x + 2 * this.canvas.lineWidth,
            pos.y + 2 * this.canvas.lineWidth,
            this.tileSize - this.canvas.lineWidth,
            this.tileSize - this.canvas.lineWidth,
        );
        this.canvas.font = `${this.fontSize}px ${this.font}`;
        this.canvas.fillStyle = BLACK_LINE;

        this.canvas.textAlign = 'center';
        this.canvas.textBaseline = 'alphabetic';
        const letterWidth = this.canvas.measureText(letter).width;

        const offset = this.tileSize / 3;
        this.canvas.font = `${this.fontSize}px ${this.font}`;
        pos.x += offset;
        pos.y += this.borderWidth + this.tileSize / 2;
        this.canvas.textBaseline = 'bottom';
        this.canvas.fillText(letter, pos.x, pos.y);

        this.canvas.font = `${this.fontSize * this.scale}px ${this.font}`;
        pos.x += letterWidth * 0.7;
        pos.y -= this.borderWidth;
        this.canvas.textBaseline = 'top';
        this.canvas.fillText(value.toString(), pos.x, pos.y);
    }

    private drawborder() {
        this.canvas.fillStyle = BORDER_COLOR;
        this.canvas.fillRect(0, 0, this.width, this.borderWidth);
        this.canvas.fillRect(0, this.height - this.borderWidth, this.width, this.borderWidth);
        this.canvas.fillRect(0, 0, this.borderWidth, this.height);
        this.canvas.fillRect(this.width - this.borderWidth, 0, this.borderWidth, this.height);
    }

    private drawColumnIdentifier() {
        this.canvas.font = `${this.fontSize}px ${this.font}`;
        this.canvas.fillStyle = IDENTIFIER_COLOR;

        for (let i = 0; i < 15; i++) {
            const letter = String.fromCharCode(i + 65);
            const offset = i * (this.canvas.lineWidth + this.tileSize) + this.offset + this.tileSize / 4;
            this.canvas.textBaseline = 'top';
            this.canvas.textAlign = 'center';
            this.canvas.fillText(letter, this.borderWidth + this.tileSize / 2, offset);
        }
    }

    private drawRowIdentifier() {
        this.canvas.font = `${this.fontSize}px ${this.font}`;
        this.canvas.fillStyle = IDENTIFIER_COLOR;

        for (let i = 0; i < 15; i++) {
            const offset = i * (this.canvas.lineWidth + this.tileSize) + this.offset + this.tileSize / 2;
            this.canvas.textBaseline = 'top';
            this.canvas.textAlign = 'center';
            this.canvas.fillText((i + 1).toString(), offset, this.tileSize / 2);
        }
    }

    private drawBonus(posBorder: Vec2, type: BonusType, mul: number) {
        this.canvas.font = `${this.fontSize * this.scale}px ${this.font}`;
        this.canvas.textAlign = 'center';
        let s = '';
        const pos = this.tilePositionToCoord(posBorder.x, posBorder.y);

        if (type === BonusType.LetterBonus) {
            s = 'Lettre';
            if (mul === 2) {
                this.canvas.fillStyle = DOUBLE_BONUS_LETTER;
            }
            if (mul === 3) {
                this.canvas.fillStyle = TRIPLE_BONUS_LETTER;
            }
        } else {
            s = 'Mot';
            if (mul === 2) {
                this.canvas.fillStyle = DOUBLE_BONUS_WORD;
            }
            if (mul === 3) {
                this.canvas.fillStyle = TRIPLE_BONUS_WORD;
            }
        }

        this.canvas.fillRect(pos.x + 1 * this.canvas.lineWidth, pos.y + 1 * this.canvas.lineWidth, this.tileSize, this.tileSize);

        this.canvas.fillStyle = BONUS_TEXT_COLOR;
        this.canvas.fillText(s, pos.x + this.tileSize / 2, pos.y + this.tileSize / 5);
        this.canvas.fillText(`X${mul}`, pos.x + this.tileSize / 2, pos.y + this.tileSize / 2);
    }

    private drawIndicator() {
        const pos = this.tilePositionToCoord(this.indicatorPos.x, this.indicatorPos.y);
        this.canvas.fillStyle = 'rgba(0.5, 0, 0, 0.25)';
        this.canvas.fillRect(pos.x + this.canvas.lineWidth, pos.y + this.canvas.lineWidth, this.tileSize, this.tileSize);

        this.canvas.fillStyle = INDICATOR_COLOR;
        if (this.indicatorDir === Direction.Horizontal) {
            this.canvas.beginPath();
            this.canvas.moveTo(pos.x, pos.y);
            this.canvas.lineTo(pos.x, pos.y + this.tileSize);
            this.canvas.lineTo(pos.x + this.tileSize, pos.y + 0.5 * this.tileSize);
            this.canvas.fill();
        } else {
            this.canvas.beginPath();
            this.canvas.moveTo(pos.x, pos.y);
            this.canvas.lineTo(pos.x + this.tileSize, pos.y);
            this.canvas.lineTo(pos.x + 0.5 * this.tileSize, pos.y + this.tileSize);
            this.canvas.fill();
        }
    }

    private drawHighlight(i: number, j: number) {
        const pos = this.tilePositionToCoord(i, j);
        this.canvas.fillStyle = 'rgba(0.5, 0, 0.5, 0.25)';
        this.canvas.fillRect(
            pos.x + 2 * this.canvas.lineWidth,
            pos.y + 2 * this.canvas.lineWidth,
            this.tileSize - this.canvas.lineWidth,
            this.tileSize - this.canvas.lineWidth,
        );
        this.canvas.strokeStyle = BORDER_TEMP_TILE;
        this.canvas.strokeRect(
            pos.x + 2 * this.canvas.lineWidth,
            pos.y + 2 * this.canvas.lineWidth,
            this.tileSize - this.canvas.lineWidth,
            this.tileSize - this.canvas.lineWidth,
        );
    }
}
