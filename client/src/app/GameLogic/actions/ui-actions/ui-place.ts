import { Action } from '@app/GameLogic/actions/action';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { UIAction } from '@app/GameLogic/actions/ui-actions/ui-action';
import { LetterPlacement } from '@app/GameLogic/actions/ui-actions/ui-place-interface';
import { BACKSPACE, BOARD_MAX_POSITION, BOARD_MIN_POSITION, JOKER_CHAR, SPACE } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Player } from '@app/GameLogic/player/player';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { isStringALowerCaseLetter, isStringAnUpperCaseLetter } from '@app/GameLogic/utils';
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
                // const nextPointerPosition = this.canMoveForwards();
                if (this.pointerPosition.x && this.pointerPosition.y && this.canUseLetter(key)) {
                    this.useLetter(key);
                }
                if (this.canMoveForwards()) {
                    this.moveForwards();
                }
                break;
        }
    }

    useLetter(key: string) {
        throw new Error('Method not implemented.');
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

    private canMoveForwards(): { x: number | null; y: number | null } {
        if (!this.pointerPosition.x || !this.pointerPosition.y) {
            return { x: null, y: null };
        }

        let deltaX = 0;
        let deltaY = 0;
        if (this.direction === Direction.Horizontal) {
            deltaX = 1;
        } else {
            deltaY = 1;
        }

        let x = this.pointerPosition.x;
        let y = this.pointerPosition.y;
        do {
            x += deltaX;
            y += deltaY;
        } while (!this.canPlaceALetterHere(x, y));

        if (!this.isInsideOfBoard(x, y)) {
            this.pointerPosition.x = null;
            this.pointerPosition.x = null;
            return { x: null, y: null };
        }
        return { x, y };
    }

    private canUseLetter(key: string): boolean {
        let letterToUse = key;
        if (isStringAnUpperCaseLetter(key)) {
            letterToUse = JOKER_CHAR;
        }
        if (isStringALowerCaseLetter(key)) {
            for (let i = 0; i < this.player.letterRack.length; i++) {
                const rackLetter = this.player.letterRack[i];
                if (rackLetter.char === letterToUse && !this.concernedIndexes.has(i)) {
                    return true;
                }
            }
        }
        return false;
    }

    private moveForwards() {
        throw new Error('Method not implemented.');
    }

    private canPlaceALetterHere(x: number, y: number): boolean {
        if (this.isInsideOfBoard(x, y)) {
            return this.board.board.grid[y][x].letterObject.char === SPACE;
        }
        return false;
    }

    private isInsideOfBoard(x: number, y: number) {
        return x >= BOARD_MIN_POSITION && x <= BOARD_MAX_POSITION && y >= BOARD_MIN_POSITION && y <= BOARD_MAX_POSITION;
    }

    private moveBackwards(): boolean {
        const lastLetter = this.orderedIndexes.pop();
        if (lastLetter !== undefined) {
            this.concernedIndexes.delete(lastLetter.rackIndex);
            this.pointerPosition.x = lastLetter.x;
            this.pointerPosition.y = lastLetter.y;
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
