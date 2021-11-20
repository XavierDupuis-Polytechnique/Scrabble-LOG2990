import { Component, Input } from '@angular/core';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveStatus } from '@app/pages/game-page/objectives/objectives-status.enum';

@Component({
    selector: 'app-objective',
    templateUrl: './objective.component.html',
    styleUrls: ['./objective.component.scss'],
})
export class ObjectiveComponent {
    @Input() objective: Objective;

    showDescription = false;

    constructor(private info: GameInfoService) {}

    descriptionToggle() {
        this.showDescription = !this.showDescription;
    }

    get status(): ObjectiveStatus {
        if (this.objective.owner === undefined) {
            return ObjectiveStatus.NotClaimed;
        }

        if (this.objective.owner === this.info.user.name) {
            return ObjectiveStatus.Won;
        }
        return ObjectiveStatus.Lost;
    }

    get progression(): number {
        return this.objective.getPlayerProgression(this.info.user.name);
    }

    get name(): string {
        return this.objective.name;
    }

    get description(): string {
        return this.objective.description;
    }

    get points(): number {
        return this.objective.points;
    }
}
