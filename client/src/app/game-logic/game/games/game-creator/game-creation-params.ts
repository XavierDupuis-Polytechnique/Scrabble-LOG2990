export interface GameCreationParams {
    timePerTurn: number;
}

export interface OfflineGameCreationParams extends GameCreationParams {
    randomBonus: boolean;
}

export interface OnlineGameCreationParams extends GameCreationParams {
    id: string;
    username: string;
}
