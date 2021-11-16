import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GameMode } from '@app/components/leaderboard.interface';
import { LeaderboardService } from '@app/components/leaderboard.service';
import { MAX_HIGHSCORE, NOT_FOUND } from '@app/game-logic/constants';
export interface HighScore {
    names: string[];
    point: number;
}
@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements AfterContentChecked, OnInit {
    columnsToDisplay = ['playerName', 'points'];
    dataSourceClassic = new MatTableDataSource<HighScore>();
    dataSourceLog = new MatTableDataSource<HighScore>();
    columns: {
        columnDef: string;
        header: string;
        cell: (score: HighScore) => string;
    }[];

    constructor(private leaderboardService: LeaderboardService, private cdref: ChangeDetectorRef) {
        this.columns = [
            {
                columnDef: 'playerName',
                header: 'Nom des joueurs',
                cell: (score: HighScore) => `${score.names}`,
            },
            {
                columnDef: 'points',
                header: 'Score',
                cell: (score: HighScore) => `${score.point}`,
            },
        ];
    }
    ngOnInit() {
        this.leaderboardService.getLeaderBoard(GameMode.Classic).subscribe((data) => {
            const scores: HighScore[] = [];
            data.forEach((obj) => {
                const indexOfScore = scores.findIndex((score: HighScore) => obj.point === score.point);
                if (indexOfScore !== NOT_FOUND) {
                    scores[indexOfScore].names.push(' ' + obj.name);
                } else {
                    scores.push({ names: [obj.name], point: obj.point });
                }
            });
            this.dataSourceClassic.data = scores.slice(0, MAX_HIGHSCORE);
        });

        this.leaderboardService.getLeaderBoard(GameMode.Log).subscribe((data) => {
            const scores: HighScore[] = [];
            data.forEach((obj) => {
                const indexOfScore = scores.findIndex((score: HighScore) => obj.point === score.point);
                if (indexOfScore !== NOT_FOUND) {
                    scores[indexOfScore].names.push(obj.name);
                } else {
                    scores.push({ names: [obj.name], point: obj.point });
                }
            });
            this.dataSourceLog.data = scores.slice(0, MAX_HIGHSCORE);
        });
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }
}
