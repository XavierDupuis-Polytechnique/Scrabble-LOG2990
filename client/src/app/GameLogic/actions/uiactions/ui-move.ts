import { Action } from '@app/GameLogic/actions/action';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';

export class UIMove implements UIAction {
    create(): Action {
        throw new Error('Method not implemented.');
    }
}
