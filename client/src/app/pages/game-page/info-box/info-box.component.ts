import { Component, OnInit } from '@angular/core';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const MILLISECONDS_IN_A_SECOND = 1000;

@Component({
    selector: 'app-info-box',
    templateUrl: './info-box.component.html',
    styleUrls: ['./info-box.component.scss'],
})
export class InfoBoxComponent implements OnInit {
    static millisecondsInASecond = MILLISECONDS_IN_A_SECOND;
    timeLeft$: Observable<number>;
    info: GameInfoService;

    constructor(info: GameInfoService) {
        this.info = info;
    }

    ngOnInit() {
        this.timeLeft$ = this.info.timeLeftForTurn.pipe(map((value: number) => value / InfoBoxComponent.millisecondsInASecond));
    }
}
