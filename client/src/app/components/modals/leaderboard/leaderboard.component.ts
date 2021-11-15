import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GameMode } from '@app/components/leaderboard.interface';
import { LeaderboardService } from '@app/components/leaderboard.service';
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
    dataSource = new MatTableDataSource<HighScore>();
    columns: {
        columnDef: string;
        header: string;
        cell: (score: HighScore) => string;
    }[];

    constructor(
        @Inject(MAT_DIALOG_DATA) private gameMode: GameMode,
        private leaderboardService: LeaderboardService,
        private cdref: ChangeDetectorRef,
    ) {
        this.columns = [
            {
                columnDef: 'playerName',
                header: 'Nom des joueurs',
                cell: (score: HighScore) => `${score.names[0]}`,
            },
            {
                columnDef: 'points',
                header: 'Score',
                cell: (score: HighScore) => `${score.point}`,
            },
        ];
    }
    ngOnInit() {
        this.leaderboardService.getLeaderBoard(this.gameMode).subscribe((data) => {
            const highScore: HighScore[] = [];
            data.forEach((obj) => {
                highScore.push({ names: [obj.name], point: obj.point });
            });
            this.dataSource.data = highScore;
        });
        this.leaderboardService.checkData();
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }
}
