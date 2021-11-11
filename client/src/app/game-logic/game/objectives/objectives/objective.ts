import { Game } from '@app/game-logic/game/games/game';

export abstract class Objective {
    name: string;
    description: string;
    owner: string | undefined;
    points: number;
    progression: number;
    get isCompleted(): boolean {
        return this.owner !== undefined;
    }
    abstract update(game: Game): void;
}
