import { Component, OnInit } from '@angular/core';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-info-box',
    templateUrl: './info-box.component.html',
    styleUrls: ['./info-box.component.scss'],
})
export class InfoBoxComponent implements OnInit {
    timeLeft$: Observable<number>;

    // TODO:Feed avec PlayerService

    myName = 'Player1';
    myScore = 55;
    activePlayer = 'Bot';

    constructor(readonly timer: TimerService) {}
    ngOnInit() {
        this.timeLeft$ = this.timer.timeLeft$.pipe(map((value: number) => value / 1000));
    }
}
