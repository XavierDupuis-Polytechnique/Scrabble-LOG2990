import { Action } from '@app/game-logic/actions/action';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

// TODO put name description in readonly
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

    update(action: Action, params: ObjectiveUpdateParams): void {
        const isAlreadyCompleted = this.isCompleted;
        if (isAlreadyCompleted) {
            return;
        }
        this.updateProgression(action, params);
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

    protected abstract updateProgression(action: Action, params: ObjectiveUpdateParams): void;
}
