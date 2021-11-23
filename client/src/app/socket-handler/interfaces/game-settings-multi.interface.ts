export interface OnlineGameSettingsUI {
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
