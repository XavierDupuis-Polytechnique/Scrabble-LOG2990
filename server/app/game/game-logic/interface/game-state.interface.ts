import { Letter } from '@app/game/game-logic/board/letter.interface';
import { Tile } from '@app/game/game-logic/board/tile';

export interface LightPlayer {
    name: string;
    points: number;
    letterRack: Letter[];
}

export interface LightObjective {
    name: string;
    description: string;
    points: number;
    owner: string | undefined;
    progressions: Map<string, number>;
}

export interface GameState {
    players: LightPlayer[];
    activePlayerIndex: number;
    grid: Tile[][];
    lettersRemaining: number;
    isEndOfGame: boolean;
    winnerIndex: number[];
}
export interface SpecialGameState extends GameState {
    publicObjectives: LightObjective[];
    privateObjectives: Map<string, LightObjective[]>;
}
export interface GameStateToken {
    gameState: GameState;
    gameToken: string;
}
