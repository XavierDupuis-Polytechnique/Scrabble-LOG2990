import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { Tile } from '@app/GameLogic/game/board/tile';

export interface GameState {
    players: LightPlayer[];
    activePlayerIndex: number;
    lettersRemaining: number;
    grid: Tile[][];
    isEndofGame: boolean;
    winnerName: string;
}
export interface LightPlayer {
    name: string;
    points: number;
    letterRack: Letter[];
}
