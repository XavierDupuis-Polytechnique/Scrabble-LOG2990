import { Action } from '@app/GameLogic/actions/action';
import { Player } from '@app/GameLogic/player/player';

export abstract class UIAction {
    concernedIndexes: Set<number>;
    abstract get canBeCreated(): boolean;
    abstract receiveRightClick(args: unknown): void;
    abstract receiveLeftClick(args: unknown): void;
    abstract create(player: Player): Action;
    abstract receiveKey(key: string): void;
}
