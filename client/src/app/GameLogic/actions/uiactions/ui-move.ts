import { Action } from '@app/GameLogic/actions/action';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';
import { Player } from '@app/GameLogic/player/player';

export class UIMove implements UIAction {
    concernedIndexes = new Set<number>();
    get canBeCreated(): boolean {
        return this.concernedIndexes.size === 1;
    }
    receiveRightClick(args: unknown): void {
        throw new Error('UIMove should not be able to receive a RightClick');
    }
    receiveLeftClick(args: unknown): void {
        const letterIndex = args as number;
        if (this.concernedIndexes.has(letterIndex)) {
            this.concernedIndexes.delete(letterIndex);
        } else {
            this.concernedIndexes.clear();
            this.concernedIndexes.add(letterIndex);
        }
        if (this.concernedIndexes.size > 1) {
            throw new Error('Only one letter should be selected for UIMove');
        }
    }
    receiveKey(key: string): void {
        throw new Error('Method not implemented.');
    }
    create(player: Player): Action {
        throw new Error('UIMove should not be able to create an Action');
    }
}
