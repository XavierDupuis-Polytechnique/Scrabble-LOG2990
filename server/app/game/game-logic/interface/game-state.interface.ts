import { Letter } from '@app/game/game-logic/board/letter.interface';
import { Tile } from '@app/game/game-logic/board/tile';

export interface LightPlayer {
    name: string;
    points: number;
    letterRack: Letter[];
}

export interface GameState {
    players: LightPlayer[];
    activePlayerIndex: number;
    grid: Tile[][];
    lettersRemaining: number;
    isEndOfGame: boolean;
    winnerIndex: number[];
}

export interface ForfeitedGameSate extends GameState {
    letterBag: Letter[];
    consecutivePass: number;
    randomBonus: boolean;
}

export interface GameStateToken {
    gameState: GameState | ForfeitedGameSate;
    gameToken: string;
}
