import { Action } from '@app/GameLogic/actions/action';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '@app/GameLogic/player/player';

export interface PlacementSetting {
    x: number;
    y: number;
    direction: string;
}

export class PlaceLetter extends Action {
    lettersToPlace: Letter[];
    placement: PlacementSetting;
    affectedTiles: Tile[] = [];

    constructor(player: Player, lettersToPlace: Letter[], placement: PlacementSetting) {
        super(player);
        this.lettersToPlace = lettersToPlace;
        this.placement = placement;
    }

    revert() {
        for (const letter of this.lettersToPlace) {
            // Peut causer des problèmes : la Game ne doit pas fournir de nouvelles lettres avant un possible .revert(game)
            this.player.letterRack.push(letter);
        }
        for (const tile of this.affectedTiles) {
            tile.letterObject.char = ' ';
        }
    }

    protected perform(game: Game) {
        let x = this.placement.x;
        let y = this.placement.y;
        const direction = this.placement.direction;
        const startTile = game.board.grid[x][y];
        let currentTile = startTile;
        let currentLetterIndex = 0;
        while (currentLetterIndex < this.lettersToPlace.length) {
            if (currentTile.letterObject == null || currentTile.letterObject.char === ' ') {
                currentTile.letterObject = this.lettersToPlace[currentLetterIndex++];
                this.affectedTiles.push(currentTile);
            }
            currentTile = this.isDirectionVertical(direction) ? game.board.grid[x][y++] : game.board.grid[x++][y];
        }
    }

    private isDirectionVertical(direction: string): boolean {
        return direction.charAt(0).toLowerCase() === 'v';
    }
}
