import { Action } from '@app/GameLogic/actions/action';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';

export class UIPlace implements UIAction {
    concernedIndexes = new Set<number>();
    //constructor(private player: Player) {}
    get canBeCreated(): boolean {
        throw new Error('Method not implemented.');
    }
    receiveRightClick(args: unknown): void {
        throw new Error('Method not implemented.');
    }
    receiveLeftClick(args: unknown): void {
        throw new Error('Method not implemented.');
    }
    receiveKey(key: string): void {
        throw new Error('Method not implemented.');
    }
    receiveRoll(args: unknown): void {
        throw new Error('Method not implemented.');
    }
    create(): Action {
        throw new Error('Method not implemented.');
    }
}
