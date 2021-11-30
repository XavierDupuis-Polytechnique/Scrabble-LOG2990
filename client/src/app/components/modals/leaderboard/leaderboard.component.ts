import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HIGHSCORES_TO_DISPLAY, NOT_FOUND } from '@app/game-logic/constants';
import { HighScore, Score } from '@app/leaderboard/leaderboard.interface';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';
import { timer } from 'rxjs';

const DELAY = 500;
const ERROR_MESSAGE = 'Impossible de se connecter au serveur';
@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements AfterContentChecked, OnInit {
    columnsToDisplay: string[] = ['playerName', 'points'];
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
    isLoading: boolean = false;
    errorMessage: string = ERROR_MESSAGE;
    constructor(private leaderboardService: LeaderboardService, private cdref: ChangeDetectorRef) {}

    ngOnInit() {
        this.getAllHighScores();
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    refresh() {
        this.isLoading = true;
        this.getAllHighScores();
        timer(DELAY).subscribe(() => {
            this.isLoading = false;
        });
    }

    private getAllHighScores() {
        this.getHighScores(GameMode.Classic);
        this.getHighScores(GameMode.Special);
    }

    private getHighScores(gameMode: GameMode) {
        const tableSource = gameMode === GameMode.Classic ? this.dataSourceClassic : this.dataSourceLog;
        this.leaderboardService.getLeaderboard(gameMode).subscribe(
            (scoresData: Score[]) => {
                tableSource.data = this.filterScores(scoresData);
            },
            () => {
                return;
            },
        );
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
