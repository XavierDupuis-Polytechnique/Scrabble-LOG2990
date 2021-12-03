import { Letter } from '@app/game/game-logic/board/letter.interface';
import { Tile } from '@app/game/game-logic/board/tile';
import { TransitionObjectives } from '@app/game/game-logic/objectives/objectives/objective-converter/transition-objectives';

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
    progressions: PlayerProgression[];
}

export interface PlayerProgression {
    playerName: string;
    progression: number;
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
    privateObjectives: PrivateLightObjectives[];
}

export interface ForfeitedGameState extends GameState {
    letterBag: Letter[];
    consecutivePass: number;
    randomBonus: boolean;
    objectives: TransitionObjectives[];
}

export interface PrivateLightObjectives {
    playerName: string;
    privateObjectives: LightObjective[];
}
export interface GameStateToken {
    gameState: GameState | ForfeitedGameState;
    gameToken: string;
}
