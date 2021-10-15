export interface GameSettingsMultiUI {
    timePerTurn: number;
    playerName: string;
    opponentName: string;
    randomBonus: boolean;
}

export interface GameSettingsMulti extends GameSettingsMultiUI {
    id: number; // TODO change to string
}
