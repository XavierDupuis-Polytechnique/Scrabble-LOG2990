import { Letter } from '@app/game-logic/game/board/letter.interface';
import { Tile } from '@app/game-logic/game/board/tile';
import { TransitionObjective } from '@app/game-logic/game/objectives/objectives/transition-objectives';

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

export interface ForfeitedGameState extends GameState {
    letterBag: Letter[];
    consecutivePass: number;
    randomBonus: boolean;
    objectives: TransitionObjective[];
}

export interface SpecialGameState extends GameState {
    publicObjectives: LightObjective[];
    privateObjectives: PrivateLightObjectives[];
}

export interface PrivateLightObjectives {
    playerName: string;
    privateObjectives: LightObjective[];
}
