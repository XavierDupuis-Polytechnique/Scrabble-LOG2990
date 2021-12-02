import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WinnersDialogComponent } from '@app/components/modals/winners-dialog/winners-dialog.component';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

export const MILISECONDS_IN_MINUTE = 60000;
export const FLOAT_TO_PERCENT = 100;
@Component({
    selector: 'app-info-box',
    templateUrl: './info-box.component.html',
    styleUrls: ['./info-box.component.scss'],
})
export class InfoBoxComponent implements OnInit {
    timeLeft$: Observable<number | undefined>;
    timeLeftPercent$: Observable<number | undefined>;
    info: GameInfoService;

    constructor(info: GameInfoService, private dialog: MatDialog) {
        this.info = info;
        if (this.info.endOfGame) {
            this.info.endOfGame.pipe(first()).subscribe(() => {
                this.openWinner();
            });
        }
    }

    ngOnInit() {
        this.timeLeft$ = this.info.timeLeftForTurn.pipe(
            map((value: number | undefined) => {
                if (value === undefined) {
                    return;
                }
                return value;
            }),
        );
        this.timeLeftPercent$ = this.info.timeLeftPercentForTurn.pipe(
            map((value: number | undefined) => {
                if (value === undefined) {
                    return;
                }
                return value * FLOAT_TO_PERCENT;
            }),
        );
    }

    isTimerLessOneMinute(timeLeft: number | null | undefined): boolean {
        if (timeLeft === null || timeLeft === undefined) {
            return true;
        }
        if (timeLeft < MILISECONDS_IN_MINUTE) {
            return true;
        }
        return false;
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

    openWinner() {
        const data = 'Félicitation ' + this.showWinner();
        this.dialog.open(WinnersDialogComponent, { disableClose: true, autoFocus: true, data });
    }
}
