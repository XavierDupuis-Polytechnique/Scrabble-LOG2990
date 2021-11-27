import { Action } from '@app/game-logic/actions/action';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { UIAction } from '@app/game-logic/actions/ui-actions/ui-action';
import { LetterPlacement } from '@app/game-logic/actions/ui-actions/ui-place-interface';
import { WordPlacement } from '@app/game-logic/actions/ui-actions/word-placement.interface';
import { BACKSPACE, BOARD_MAX_POSITION, BOARD_MIN_POSITION, EMPTY_CHAR, JOKER_CHAR, MIN_PLACE_LETTER_ARG_SIZE } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { LetterCreator } from '@app/game-logic/game/board/letter-creator';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { convertToProperLetter, isStringALowerCaseLetter, isStringAnUpperCaseLetter } from '@app/game-logic/utils';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';

export class UIPlace implements UIAction {
    concernedIndexes = new Set<number>();
    orderedIndexes: LetterPlacement[] = [];
    letterCreator = new LetterCreator();
    direction = Direction.Horizontal;
    pointerPosition: { x: number; y: number } | null = null;

    constructor(
        private info: GameInfoService,
        private pointCalculator: PointCalculatorService,
        private wordSearcher: WordSearcher,
        private boardService: BoardService,
    ) {}

    get canBeCreated(): boolean {
        return this.orderedIndexes.length > 0 && this.concernedIndexes.size > 0;
    }

    receiveRightClick(): void {
        return;
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
        if (this.info.activePlayer !== this.info.user) {
            return;
        }
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
        return;
    }

    create(): Action {
        const wordPlacement = this.getWordFromBoard();
        const createdAction = new PlaceLetter(
            this.info.user,
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

    private getWordFromBoard(): WordPlacement {
        let wordPlacementFound = this.direction === Direction.Horizontal ? this.getHorizontalWordFromBoard() : this.getVerticalWordFromBoard();
        if (wordPlacementFound.word.length < MIN_PLACE_LETTER_ARG_SIZE - 1) {
            wordPlacementFound = this.direction === Direction.Horizontal ? this.getVerticalWordFromBoard() : this.getHorizontalWordFromBoard();
            this.direction = this.direction === Direction.Horizontal ? Direction.Vertical : Direction.Horizontal;
        }
        return wordPlacementFound;
    }

    private getVerticalWordFromBoard(): WordPlacement {
        const lastLetterPlacement = this.orderedIndexes[this.orderedIndexes.length - 1];
        const x = lastLetterPlacement.x;
        let y = lastLetterPlacement.y;
        let currentTileChar;
        let word = '';
        while (this.isThereALetter(x, y)) {
            y++;
        }
        y--;
        do {
            currentTileChar = this.boardService.board.grid[y][x].letterObject;
            if (currentTileChar.value === 0) {
                word = currentTileChar.char.toUpperCase() + word;
            } else {
                word = currentTileChar.char.toLowerCase() + word;
            }
            y--;
        } while (this.isThereALetter(x, y));
        y++;
        return { word, x, y };
    }

    private getHorizontalWordFromBoard(): WordPlacement {
        const lastLetterPlacement = this.orderedIndexes[this.orderedIndexes.length - 1];
        let x = lastLetterPlacement.x;
        const y = lastLetterPlacement.y;
        let currentTileChar;
        let word = '';
        while (this.isThereALetter(x, y)) {
            x++;
        }
        x--;
        do {
            currentTileChar = this.boardService.board.grid[y][x].letterObject;
            if (currentTileChar.value === 0) {
                word = currentTileChar.char.toUpperCase() + word;
            } else {
                word = currentTileChar.char.toLowerCase() + word;
            }
            x--;
        } while (this.isThereALetter(x, y));
        x++;
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
        const usedChar = this.info.user.letterRack[possibleLetterIndex].char;
        if (usedChar === JOKER_CHAR) {
            concernedTile.letterObject = this.letterCreator.createBlankLetter(key);
            concernedTile.letterObject.isTemp = true;
            return true;
        }
        concernedTile.letterObject = this.letterCreator.createLetter(usedChar);
        concernedTile.letterObject.isTemp = true;
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
        for (let index = 0; index < this.info.user.letterRack.length; index++) {
            const rackLetter = this.info.user.letterRack[index];
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
