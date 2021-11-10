import { Tile } from '@app/game-logic/game/board/tile';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';

export interface Word {
    letters: Tile[];
    index: number[];
}

export interface WordPlacement {
    word: string;
    placement: PlacementSetting;
}
