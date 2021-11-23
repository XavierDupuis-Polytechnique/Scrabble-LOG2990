import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HIGHSCORES_TO_DISPLAY, NOT_FOUND } from '@app/game-logic/constants';
import { GameMode } from '@app/leaderboard/game-mode.enum';
import { HighScore, Score } from '@app/leaderboard/leaderboard.interface';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
import { timer } from 'rxjs';

const DELAY = 500;
@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements AfterContentChecked, OnInit {
    columnsToDisplay = ['playerName', 'points'];
    dataSourceClassic = new MatTableDataSource<HighScore>();
    dataSourceLog = new MatTableDataSource<HighScore>();
    columns = [
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
    loading = false;

    constructor(private leaderboardService: LeaderboardService, private cdref: ChangeDetectorRef) {}

    ngOnInit() {
        this.getAllHighScores();
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    refresh() {
        this.loading = true;
        this.getAllHighScores();
        timer(DELAY).subscribe(() => {
            this.loading = false;
        });
    }

    private getAllHighScores() {
        this.getHighScores(GameMode.Classic);
        this.getHighScores(GameMode.Log);
    }

    private getHighScores(gameMode: GameMode) {
        const tableSource = gameMode === GameMode.Classic ? this.dataSourceClassic : this.dataSourceLog;
        this.leaderboardService.getLeaderboard(gameMode).subscribe((scoresData: Score[]) => {
            tableSource.data = this.filterScores(scoresData);
        });
    }

    private filterScores(scores: Score[]): HighScore[] {
        const highScores: HighScore[] = [];
        scores.forEach((scoreData: Score) => {
            const indexOfScore = highScores.findIndex((score: HighScore) => scoreData.point === score.point);
            if (indexOfScore !== NOT_FOUND) {
                highScores[indexOfScore].names.push(' ' + scoreData.name);
            } else {
                highScores.push({ names: [scoreData.name], point: scoreData.point });
            }
        });
        return highScores.slice(0, HIGHSCORES_TO_DISPLAY);
    }
}
