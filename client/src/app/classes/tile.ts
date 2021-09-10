export interface Tile {
    multiplicator: number;
    value: string;
}

export const newTile = (): Tile => {
    return {
        multiplicator: 1,
        value: '',
    };
};
