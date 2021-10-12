import { Action } from '@app/GameLogic/actions/action';
import { Player } from '@app/GameLogic/player/player';

export abstract class UIAction {
    abstract create(player: Player): Action;
    abstract receiveKey(key: string): void;
}
