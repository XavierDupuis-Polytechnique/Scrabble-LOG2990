import { OnlineActionType } from '@app/game/online-action.enum';

export interface OnlineAction {
    type: OnlineActionType;
    args?: string[];
}
