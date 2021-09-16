import { Action } from '@app/GameLogic/actions/action';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Player } from '@app/GameLogic/player/player';

export interface PlacementSetting {
    x: number;
    y: number;
    direction: string;
}

export class PlaceLetter extends Action {
    letterToPlace: Letter[];
    placement: PlacementSetting;
    constructor(player: Player, letterToPlace: Letter[], placement: PlacementSetting) {
        super(player);
        this.letterToPlace = letterToPlace;
        this.placement = placement;
    }

    // TODO implement placeLetter action
    protected perform(game: Game) {
        return;
    }
}
