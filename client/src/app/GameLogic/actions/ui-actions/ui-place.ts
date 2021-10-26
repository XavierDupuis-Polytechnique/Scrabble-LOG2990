import { Action } from '@app/GameLogic/actions/action';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { UIAction } from '@app/GameLogic/actions/ui-actions/ui-action';
import { LetterPlacement } from '@app/GameLogic/actions/ui-actions/ui-place-interface';
import { WordPlacement } from '@app/GameLogic/actions/ui-actions/word-placement.interface';
import { BACKSPACE, BOARD_MAX_POSITION, BOARD_MIN_POSITION, EMPTY_CHAR, JOKER_CHAR } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { Player } from '@app/GameLogic/player/player';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { convertToProperLetter, isStringALowerCaseLetter, isStringAnUpperCaseLetter } from '@app/GameLogic/utils';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';

export class UIPlace implements UIAction {
    concernedIndexes = new Set<number>();
    orderedIndexes: LetterPlacement[] = [];
    letterCreator = new LetterCreator();
    direction = Direction.Horizontal;
    pointerPosition: { x: number; y: number } | null = null;

    constructor(
        private player: Player,
        private pointCalculator: PointCalculatorService,
        private wordSearcher: WordSearcher,
        private boardService: BoardService,
    ) {}

    get canBeCreated(): boolean {
        return this.orderedIndexes.length > 0 && this.concernedIndexes.size > 0;
    }

    receiveRightClick(): void {
        throw new Error('UIPlace should not be able to receive a RightClick');
    }

    receiveLeftClick(args: unknown): void {
        const clickPosition = args as { x: number; y: number };
        if (this.isPlacementInProgress()) {
            return;
        }
        if (this.canPlaceALetterHere(clickPosition.x, clickPosition.y)) {
            if (this.isSamePositionClicked(clickPosition)) {
                this.toggleDirection();
                return;
            }
            this.pointerPosition = clickPosition;
            this.direction = Direction.Horizontal;
        }
    }

    receiveKey(key: string): void {
        switch (key) {
            case BACKSPACE:
                this.moveBackwards();
                return;
            default:
                if (this.useLetter(key)) {
                    this.moveForwards();
                }
                break;
        }
    }

    receiveRoll(): void {
        throw new Error('UIExchange should not be able to receive a MouseRoll');
    }

    create(): Action {
        const wordPlacement = this.getWordFromBoard();
        const createdAction = new PlaceLetter(
            this.player,
            wordPlacement.word,
            { direction: this.direction, x: wordPlacement.x, y: wordPlacement.y },
            this.pointCalculator,
            this.wordSearcher,
        );
        return createdAction;
    }

    destroy(): void {
        for (const placement of this.orderedIndexes) {
            const newBlankLetter = this.letterCreator.createBlankLetter(' ');
            this.boardService.board.grid[placement.y][placement.x].letterObject = newBlankLetter;
        }
        this.pointerPosition = null;
    }

    private isSamePositionClicked(clickPosition: { x: number; y: number }) {
        if (!this.pointerPosition) {
            return false;
        }
        return clickPosition.x === this.pointerPosition.x && clickPosition.y === this.pointerPosition.y;
    }

    // TODO : REFACTOR, REASON : TRASH
    private getWordFromBoard(): WordPlacement {
        const lastLetterPlacement = this.orderedIndexes[this.orderedIndexes.length - 1];
        let x = lastLetterPlacement.x;
        let y = lastLetterPlacement.y;
        let currentTileChar;
        let word = '';
        while (this.isThereALetter(x, y)) {
            if (this.direction === Direction.Vertical) {
                y++;
            } else {
                x++;
            }
        }
        if (this.direction === Direction.Vertical) {
            y--;
        } else {
            x--;
        }
        do {
            currentTileChar = this.boardService.board.grid[y][x].letterObject.char;
            // TODO : MANAGE JOKER
            word = currentTileChar.toLowerCase() + word;
            // console.log('partial word : ' + word);
            if (this.direction === Direction.Vertical) {
                y--;
            } else {
                x--;
            }
        } while (this.isThereALetter(x, y));
        return { word, x, y };
    }

    private isThereALetter(x: number, y: number) {
        if (!this.isInsideOfBoard(x, y)) {
            return false;
        }
        return this.boardService.board.grid[y][x].letterObject.char !== EMPTY_CHAR;
    }

    private useLetter(key: string): boolean {
        if (!this.pointerPosition) {
            return false;
        }
        const possibleLetterIndex = this.canUseLetter(key);
        if (possibleLetterIndex === null) {
            return false;
        }
        const newLetterPlacement: LetterPlacement = { x: this.pointerPosition.x, y: this.pointerPosition.y, rackIndex: possibleLetterIndex };
        this.concernedIndexes.add(possibleLetterIndex);
        this.orderedIndexes.push(newLetterPlacement);
        const concernedTile = this.boardService.board.grid[this.pointerPosition.y][this.pointerPosition.x];
        let usedChar = this.player.letterRack[possibleLetterIndex].char;
        if (usedChar === JOKER_CHAR) {
            usedChar = key;
        }
        const newTile = this.letterCreator.createLetter(usedChar);
        concernedTile.letterObject = newTile;
        return true;
    }

    private moveForwards(): boolean {
        if (!this.pointerPosition) {
            return false;
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
            if (this.canPlaceALetterHere(x, y)) {
                this.pointerPosition = { x, y };
                return true;
            }
        } while (this.isInsideOfBoard(x, y));

        this.pointerPosition = null;
        return false;
    }

    private canUseLetter(key: string): number | null {
        let letter = convertToProperLetter(key);
        if (isStringAnUpperCaseLetter(letter)) {
            letter = JOKER_CHAR;
        }
        if (isStringALowerCaseLetter(letter) || letter === JOKER_CHAR) {
            return this.findUnusedLetterIndex(letter);
        }
        return null;
    }

    private findUnusedLetterIndex(char: string): number | null {
        for (let index = 0; index < this.player.letterRack.length; index++) {
            const rackLetter = this.player.letterRack[index];
            if (rackLetter.char.toLowerCase() === char && !this.concernedIndexes.has(index)) {
                return index;
            }
        }
        return null;
    }

    private canPlaceALetterHere(x: number, y: number): boolean {
        if (!this.isInsideOfBoard(x, y)) {
            return false;
        }
        return this.boardService.board.grid[y][x].letterObject.char === EMPTY_CHAR;
    }

    private isInsideOfBoard(x: number, y: number) {
        return x >= BOARD_MIN_POSITION && x <= BOARD_MAX_POSITION && y >= BOARD_MIN_POSITION && y <= BOARD_MAX_POSITION;
    }

    private moveBackwards(): boolean {
        const lastLetter = this.orderedIndexes.pop();
        if (lastLetter !== undefined) {
            const newBlankLetter = this.letterCreator.createBlankLetter(' ');
            this.boardService.board.grid[lastLetter.y][lastLetter.x].letterObject = newBlankLetter;
            this.concernedIndexes.delete(lastLetter.rackIndex);
            this.pointerPosition = { x: lastLetter.x, y: lastLetter.y };
            return true;
        }
        return false;
    }

    private isPlacementInProgress(): boolean {
        return this.canBeCreated;
    }

    private toggleDirection(): void {
        if (!this.isPlacementInProgress()) {
            this.direction = this.direction === Direction.Horizontal ? Direction.Vertical : Direction.Horizontal;
        }
    }
}
