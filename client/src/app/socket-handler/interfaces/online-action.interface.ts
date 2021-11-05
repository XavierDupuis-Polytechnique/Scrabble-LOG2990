import { Letter } from '@app/game-logic/game/board/letter.interface';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';

export interface OnlineAction {
    type: OnlineActionType;
    placementSettings?: PlacementSetting;
    letters?: string;
    letterRack?: Letter[];
}

export enum OnlineActionType {
    Place = 'place',
    Exchange = 'exchange',
    Pass = 'pass',
}
