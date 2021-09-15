import { Component, OnInit } from '@angular/core';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';

@Component({
    selector: 'app-info-box',
    templateUrl: './info-box.component.html',
    styleUrls: ['./info-box.component.scss'],
})
export class InfoBoxComponent implements OnInit {
    //TODO:Feed avec PlayerService
    myName = 'Player1';
    myScore = 55;
    activePlayer = 'Bot';
    constructor(public readonly timer: TimerService) {}
    ngOnInit() {
        // TODO: doesn't feed timer value..
    }
}
