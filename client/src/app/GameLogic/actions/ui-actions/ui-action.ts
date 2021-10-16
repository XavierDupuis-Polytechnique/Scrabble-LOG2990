import { Action } from '@app/GameLogic/actions/action';

export abstract class UIAction {
    concernedIndexes: Set<number>;
    abstract get canBeCreated(): boolean;
    abstract receiveRightClick(args: unknown): void;
    abstract receiveLeftClick(args: unknown): void;
    abstract receiveKey(key: string): void;
    abstract receiveRoll(args: unknown): void;
    abstract create(): Action;
}
