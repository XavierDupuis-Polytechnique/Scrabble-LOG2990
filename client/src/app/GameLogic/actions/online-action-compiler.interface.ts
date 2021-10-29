import { PlacementSetting } from '@app/GameLogic/interface/placement-setting.interface';

export interface OnlineAction {
    type: OnlineActionType;
    placementSettings?: PlacementSetting;
    letters?: string;
}

export enum OnlineActionType {
    Place = 'place',
    Exchange = 'exchange',
    Pass = 'pass',
}
