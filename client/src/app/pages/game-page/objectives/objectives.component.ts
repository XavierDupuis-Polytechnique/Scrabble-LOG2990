import { Component } from '@angular/core';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';

@Component({
    selector: 'app-objectives',
    templateUrl: './objectives.component.html',
    styleUrls: ['./objectives.component.scss'],
})
export class ObjectivesComponent {
    constructor(public info: GameInfoService) {}
}
