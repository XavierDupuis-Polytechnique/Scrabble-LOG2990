import { Action } from '@app/game-logic/actions/action';
import { Game } from '@app/game-logic/game/games/game';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';

export abstract class Objective {
    name: string;
    description: string;
    owner: string | undefined;
    points: number;
    progression = 0;
    get isCompleted(): boolean {
        return this.progression === 1;
    }

    constructor(private objectiveNotifier: ObjectiveNotifierService) {}

    update(action: Action, game: Game): void {
        this.updateProgression(action, game);
        if (this.isCompleted) {
            this.updateOwner(action);
            this.updatePoints(action);
            this.sendCompletionMessage();
        }
    }

    private updateOwner(action: Action) {
        this.owner = action.player.name;
    }

    private updatePoints(action: Action) {
        action.player.points += this.points;
    }

    private sendCompletionMessage() {
        this.objectiveNotifier.sendObjectiveNotification(this);
    }

    abstract updateProgression(action: Action, game: Game): void;
}
