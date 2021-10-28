import { LetterBag } from '@app/game/game-logic/board/letter-bag';
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
    letterBag: LetterBag;
    isEndOfGame: boolean;
    winnerIndex: number[];
}

export interface GameStateToken {
    gameState: GameState;
    gameToken: string;
}
