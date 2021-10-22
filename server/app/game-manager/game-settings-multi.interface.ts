export interface GameSettingsMultiUI {
    timePerTurn: number;
    playerName: string;
    opponentName?: string;
    randomBonus: boolean;
}

export interface GameSettingsMulti extends GameSettingsMultiUI {
    id: string; // TODO change to string
}
