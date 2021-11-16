import { Action } from '@app/game-logic/actions/action';
import { Game } from '@app/game-logic/game/games/game';

export abstract class Objective {
    name: string;
    description: string;
    owner: string | undefined;
    points: number;
    progression = 0;
    get isCompleted(): boolean {
        return this.progression === 1;
    }

    update(action: Action, game: Game): void {
        this.updateProgression(action, game);
        if (this.isCompleted) {
            this.updateOwner(action);
            this.updatePoints(action);
            this.sendCompletionMessage(action, game);
        }
    }

    private updateOwner(action: Action) {
        this.owner = action.player.name;
    }

    private updatePoints(action: Action) {
        action.player.points += this.points;
    }

    private sendCompletionMessage(action: Action, game: Game) {
        return;
    }

    abstract updateProgression(action: Action, game: Game): void;
}
