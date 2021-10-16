import { Action } from '@app/GameLogic/actions/action';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { UIAction } from '@app/GameLogic/actions/ui-actions/ui-action';
import { LetterPlacement } from '@app/GameLogic/actions/ui-actions/ui-place-interface';
import { BACKSPACE, BOARD_MAX_POSITION, BOARD_MIN_POSITION, SPACE } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Tile } from '@app/GameLogic/game/board/tile';
import { Player } from '@app/GameLogic/player/player';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';

export class UIPlace implements UIAction {
    concernedIndexes = new Set<number>();
    orderedIndexes: LetterPlacement[] = [];
    direction = Direction.Horizontal;
    pointerPosition: { x: number | null; y: number | null } = { x: null, y: null };

    // TODO : NEXT LINE MUST BE A CONSTRUCTOR ATTRIBUTE
    board = new BoardService();

    constructor(private player: Player) {}

    get canBeCreated(): boolean {
        throw new Error('Method not implemented.');
    }

    receiveRightClick(): void {
        throw new Error('UIPlace should not be able to receive a RightClick');
    }

    receiveLeftClick(args: unknown): void {
        if (!this.isPlacementInProgress()) {
            const clickPosition = args as { x: number; y: number };
            if (clickPosition === this.pointerPosition) {
                this.toggleDirection();
                return;
            }
            this.pointerPosition = clickPosition;
            this.moveForwards();
        }
    }

    receiveKey(key: string): void {
        switch (key) {
            case BACKSPACE:
                this.moveBackwards();
                break;
            default:
                break;
        }
    }

    receiveRoll(): void {
        throw new Error('UIExchange should not be able to receive a MouseRoll');
    }

    create(): Action {
        return new PlaceLetter(
            this.player,
            '',
            { direction: this.direction, x: 0, y: 0 },
            new PointCalculatorService(new BoardService()),
            new WordSearcher(new BoardService(), new DictionaryService()),
        );
    }

    private moveForwards() {
        if (this.pointerPosition.x && this.pointerPosition.y) {
            let deltaX = 0;
            let deltaY = 0;
            if (this.direction === Direction.Horizontal) {
                deltaX = 1;
            } else {
                deltaY = 1;
            }
            let x = this.pointerPosition.x;
            let y = this.pointerPosition.y;
            let nextPossibleTile = this.board.board.grid[y][x];
            do {
                x += deltaX;
                y += deltaY;
                nextPossibleTile = this.board.board.grid[y][x];
            } while (!this.canPlaceALetterHere(nextPossibleTile, x, y));
        }
    }

    private canPlaceALetterHere(nextPossibleTile: Tile, x: number, y: number): boolean {
        return this.isInsideOfBoard(x, y) && nextPossibleTile.letterObject.char === SPACE;
    }

    private isInsideOfBoard(x: number, y: number) {
        return x >= BOARD_MIN_POSITION && x <= BOARD_MAX_POSITION && y >= BOARD_MIN_POSITION && y <= BOARD_MAX_POSITION;
    }

    private moveBackwards() {
        // ** NEVER ALWAYS --x or --y (case where --x * n times)
        this.removeLastLetter();
        throw new Error('Method not implemented.');
    }

    private removeLastLetter(): boolean {
        const lastLetter = this.orderedIndexes.pop();
        if (lastLetter !== undefined) {
            this.concernedIndexes.delete(lastLetter.rackIndex);
            return true;
        }
        return false;
    }

    private isPlacementInProgress(): boolean {
        return this.concernedIndexes.size > 0;
    }

    private toggleDirection(): void {
        if (!this.isPlacementInProgress()) {
            this.direction = this.direction === Direction.Horizontal ? Direction.Vertical : Direction.Horizontal;
        }
    }
}
