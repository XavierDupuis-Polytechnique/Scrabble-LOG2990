export enum GameMode {
    Classic = 'classic',
    Log = 'log',
}

export interface Score {
    name: string;
    point: number;
}

export interface HighScore {
    names: string[];
    point: number;
}
