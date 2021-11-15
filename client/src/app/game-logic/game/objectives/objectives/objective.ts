import { Action } from '@app/game-logic/actions/action';
import { Game } from '@app/game-logic/game/games/game';

export abstract class Objective {
    name: string;
    description: string;
    owner: string | undefined;
    points: number;
    progression = 0;
    get isCompleted(): boolean {
        return this.owner !== undefined;
    }
    abstract update(action: Action, game: Game): void;
}
