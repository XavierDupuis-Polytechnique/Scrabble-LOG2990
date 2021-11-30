import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';

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
