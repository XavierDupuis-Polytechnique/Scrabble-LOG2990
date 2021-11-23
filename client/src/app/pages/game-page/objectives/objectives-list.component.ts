import { Component } from '@angular/core';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';

@Component({
    selector: 'app-objectives-list',
    templateUrl: './objectives-list.component.html',
    styleUrls: ['./objectives-list.component.scss'],
})
export class ObjectivesListComponent {
    constructor(public info: GameInfoService) {}

    get publicObjectives() {
        return this.info.publicObjectives;
    }

    get privateObjectives() {
        return this.info.privateObjectives;
    }
}
