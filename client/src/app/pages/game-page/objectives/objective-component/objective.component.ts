import { Component, Input } from '@angular/core';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

@Component({
    selector: 'app-objective',
    templateUrl: './objective.component.html',
    styleUrls: ['./objective.component.scss'],
})
export class ObjectiveComponent {
    @Input() objective: Objective;

    get name(): string {
        return this.objective.name;
    }

    get description(): string {
        return this.objective.description;
    }
}
