import { PlacementSetting } from '@app/game/game-logic/interface/placement-setting.interface';
import { OnlineActionType } from '@app/game/online-action.enum';

export interface OnlineAction {
    type: OnlineActionType;
    placementSettings?: PlacementSetting;
    letters?: string;
}
