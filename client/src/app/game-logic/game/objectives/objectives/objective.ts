import { Action } from '@app/game-logic/actions/action';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';
export abstract class Objective {
    readonly name: string;
    readonly description: string;
    readonly points: number;
    owner: string | undefined;
    progressions = new Map<string, number>();

    get isCompleted(): boolean {
        for (const [, progression] of this.progressions) {
            if (progression === 1) {
                return true;
            }
        }
        return false;
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

    getPlayerProgression(name: string): number {
        const progression = this.progressions.get(name);
        if (progression === undefined) {
            return 0;
        }
        return progression;
    }

    protected setPlayerProgression(name: string, newProgression: number) {
        this.progressions.set(name, newProgression);
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
