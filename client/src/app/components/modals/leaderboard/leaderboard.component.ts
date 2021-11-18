import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HIGHSCORES_TO_DISPLAY, NOT_FOUND } from '@app/game-logic/constants';
import { GameMode } from '@app/leaderboard/game-mode.enum';
import { HighScore, Score } from '@app/leaderboard/leaderboard.interface';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
import { BehaviorSubject } from 'rxjs';
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
    private scores$ = new BehaviorSubject<Score[]>([]);

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
        this.refresh();
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    refresh() {
        this.getHighScores(GameMode.Classic);
        this.getHighScores(GameMode.Log);
    }

    private getHighScores(gameMode: GameMode) {
        const tableSource = gameMode === GameMode.Classic ? this.dataSourceClassic : this.dataSourceLog;
        this.leaderboardService.getLeaderBoard(gameMode).subscribe((scoresData: Score[]) => {
            this.scores$.next(scoresData);
        });
        this.scores$.subscribe((scoresData: Score[]) => {
            tableSource.data = this.filterScores(scoresData);
        });
    }

    private filterScores(scores: Score[]): HighScore[] {
        const highScores: HighScore[] = [];
        scores.forEach((scoreData: Score) => {
            const indexOfScore = highScores.findIndex((score: HighScore) => scoreData.point === score.point);
            if (indexOfScore !== NOT_FOUND) {
                highScores[indexOfScore].names.push(scoreData.name);
            } else {
                highScores.push({ names: [scoreData.name], point: scoreData.point });
            }
        });
        return highScores.slice(0, HIGHSCORES_TO_DISPLAY);
    }
}
