import { Action } from '@app/game-logic/actions/action';
import { UIAction } from '@app/game-logic/actions/ui-actions/ui-action';
import { ARROWLEFT, ARROWRIGHT, JOKER_CHAR, NOT_FOUND, RACK_LETTER_COUNT, SHIFT } from '@app/game-logic/constants';
import { WheelRoll } from '@app/game-logic/interfaces/ui-input';
import { Player } from '@app/game-logic/player/player';
import { isStringALowerCaseLetter } from '@app/game-logic/utils';

export class UIMove implements UIAction {
    concernedIndexes = new Set<number>();

    constructor(private player: Player) {}

    get canBeCreated(): boolean {
        return this.concernedIndexes.size === 1;
    }

    receiveRightClick(): void {
        return;
    }

    receiveLeftClick(args: unknown): void {
        const letterIndex = args as number;
        this.storeLetterIndex(letterIndex);
    }

    receiveKey(key: string): void {
        switch (key) {
            case ARROWLEFT:
                this.moveLeft();
                return;
            case ARROWRIGHT:
                this.moveRight();
                return;
            case SHIFT:
                return;
            default:
                this.processKey(key);
        }
    }

    receiveRoll(args: unknown): void {
        const rollDirection = args as WheelRoll;
        if (rollDirection === WheelRoll.UP) {
            this.moveLeft();
        }
        if (rollDirection === WheelRoll.DOWN) {
            this.moveRight();
        }
    }

    create(): Action | null {
        return null;
    }

    destroy(): void {
        return;
    }

    private processKey(key: string) {
        if (!isStringALowerCaseLetter(key) && key !== JOKER_CHAR) {
            this.concernedIndexes.clear();
            return;
        }
        let currentIndex = this.getCurrentIndex();
        if (isNaN(currentIndex)) {
            currentIndex = NOT_FOUND;
        }
        const newIndex = this.findNextLetterIndex(currentIndex + 1, key);
        if (newIndex !== undefined) {
            this.storeLetterIndex(newIndex);
            return;
        }
        this.concernedIndexes.clear();
    }

    private moveRight() {
        if (!this.canBeCreated) {
            return;
        }
        const currentLetterIndex = this.getCurrentIndex();
        const rightLetterIndex = (currentLetterIndex + 1) % RACK_LETTER_COUNT;
        this.swapLetters(currentLetterIndex, rightLetterIndex);
    }

    private moveLeft() {
        if (!this.canBeCreated) {
            return;
        }
        const currentLetterIndex = this.getCurrentIndex();
        const leftLetterIndex = (currentLetterIndex + RACK_LETTER_COUNT - 1) % RACK_LETTER_COUNT;
        this.swapLetters(currentLetterIndex, leftLetterIndex);
    }

    private swapLetters(oldIndex: number, newIndex: number) {
        const firstLetterCopy = { ...this.player.letterRack[oldIndex] };
        this.player.letterRack[oldIndex] = this.player.letterRack[newIndex];
        this.player.letterRack[newIndex] = firstLetterCopy;
        this.storeLetterIndex(newIndex);
    }

    private getCurrentIndex(): number {
        return this.concernedIndexes.values().next().value;
    }

    private findNextLetterIndex(nextIndex: number, char: string): number | undefined {
        for (let i = 0; i < RACK_LETTER_COUNT; i++) {
            const currentIndex = (i + nextIndex) % RACK_LETTER_COUNT;
            if (this.player.letterRack[currentIndex].char.toLowerCase() === char) {
                return currentIndex;
            }
        }
        return undefined;
    }

    private storeLetterIndex(letterIndex: number) {
        if (this.concernedIndexes.has(letterIndex)) {
            this.concernedIndexes.delete(letterIndex);
        } else {
            this.concernedIndexes.clear();
            this.concernedIndexes.add(letterIndex);
        }
        if (this.concernedIndexes.size > 1) {
            throw Error('Only one letter should be selected for UIMove');
        }
    }
}
