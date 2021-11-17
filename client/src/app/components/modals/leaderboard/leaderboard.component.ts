import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HIGHSCORES_TO_DISPLAY, NOT_FOUND } from '@app/game-logic/constants';
import { GameMode, Score } from '@app/leaderboard/leaderboard.interface';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements AfterContentChecked, OnInit {
    columnsToDisplay = ['playerName', 'points'];
    dataSourceClassic = new MatTableDataSource<Score>();
    dataSourceLog = new MatTableDataSource<Score>();
    columns: {
        columnDef: string;
        header: string;
        cell: (score: Score) => string;
    }[];

    constructor(private leaderboardService: LeaderboardService, private cdref: ChangeDetectorRef) {
        this.columns = [
            {
                columnDef: 'playerName',
                header: 'Nom des joueurs',
                cell: (score: Score) => `${score.names}`,
            },
            {
                columnDef: 'points',
                header: 'Score',
                cell: (score: Score) => `${score.point}`,
            },
        ];
    }
    ngOnInit() {
        this.refresh();
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    refresh() {
        this.getScore(GameMode.Classic, this.dataSourceClassic.data);
        this.getScore(GameMode.Log, this.dataSourceLog.data);
    }

    private getScore(gameMode: GameMode): Score[] {
        this.leaderboardService.scores$.subscribe((scoresData: Score[]) => {
            const scores: Score[] = [];
            scoresData.forEach((score: Score) => {
                const indexOfScore = scores.findIndex((score: Score) => obj.point === score.point);
                if (indexOfScore !== NOT_FOUND) {
                    scores[indexOfScore].names.push(obj.name);
                } else {
                    scores.push({ names: [obj.name], point: obj.point });
                }
            });
            return scores.slice(0, HIGHSCORES_TO_DISPLAY);
        });
    }
}
