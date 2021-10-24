export interface OnlineGameSettingsUI {
    timePerTurn: number;
    playerName: string;
    opponentName?: string;
    randomBonus: boolean;
}

export interface OnlineGameSettings extends OnlineGameSettingsUI {
    id: string; // TODO change to string
}
