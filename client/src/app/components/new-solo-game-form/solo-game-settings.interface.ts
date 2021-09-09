export interface SoloGameSettings {
    playerName: string | undefined;
    adversaryLevel: string | undefined;
    timePerTurn: number | null;
}

export const newSoloGameSettings = (): SoloGameSettings => {
    return {
        playerName: undefined,
        adversaryLevel: undefined,
        timePerTurn: null,
    };
};
