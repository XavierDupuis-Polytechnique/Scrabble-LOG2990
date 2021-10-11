import { Action } from '@app/GameLogic/actions/action';

export abstract class UIAction {
    abstract create(): Action
}
