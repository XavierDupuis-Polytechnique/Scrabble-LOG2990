import { GameMode } from '@app/game/game-mode.enum';

export interface OnlineGameSettingsUI {
    gameMode: GameMode;
    timePerTurn: number;
    playerName: string;
    opponentName?: string;
    randomBonus: boolean;
    dictTitle: string;
    dictDesc?: string;
}

export interface OnlineGameSettings extends OnlineGameSettingsUI {
    id: string;
}
