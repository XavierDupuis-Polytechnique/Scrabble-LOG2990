import { Direction } from '@app/game/game-logic/actions/direction.enum';

export interface PlacementSetting {
    x: number;
    y: number;
    direction: Direction;
}
