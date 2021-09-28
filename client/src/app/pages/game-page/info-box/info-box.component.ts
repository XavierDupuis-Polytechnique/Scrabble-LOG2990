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
    timeLeft$: Observable<number | undefined>;
    info: GameInfoService;

    constructor(info: GameInfoService) {
        this.info = info;
    }

    ngOnInit() {
        this.timeLeft$ = this.info.timeLeftForTurn.pipe(
            map((value: number | undefined) => {
                if (value === undefined) {
                    return;
                }
                return value / InfoBoxComponent.millisecondsInASecond;
            }),
        );
    }

    showWinner(): string {
        const winner = this.info.winner;
        let winnerString = '';
        if (winner.length !== 1) {
            winnerString = winner[0].name + ' et ' + winner[1].name;
        } else {
            winnerString = winner[0].name;
        }
        return winnerString;
    }
}
