import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export class OnlineObjective extends Objective {
    constructor(objectiveNotifier: ObjectiveNotifierService, readonly name: string, readonly description: string, readonly points: number) {
        super(objectiveNotifier);
    }

    protected updateProgression(): void {
        return;
    }
}
