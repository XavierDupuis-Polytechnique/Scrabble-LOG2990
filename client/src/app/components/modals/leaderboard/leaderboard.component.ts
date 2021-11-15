import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
export interface Score {
    playerNames: string[];
    point: number;
}
@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements AfterContentChecked, OnInit {
    columnsToDisplay = ['playerName', 'points'];
    dataSource = new MatTableDataSource<Score>();
    columns: {
        columnDef: string;
        header: string;
        cell: (score: Score) => string;
    }[];

    constructor(@Inject(MAT_DIALOG_DATA) public data: Score[], private cdref: ChangeDetectorRef) {
        this.columns = [
            {
                columnDef: 'playerName',
                header: 'Nom des joueurs',
                cell: (score: Score) => `${score.playerNames}`,
            },
            {
                columnDef: 'points',
                header: 'Score',
                cell: (score: Score) => `${score.point}`,
            },
        ];
    }
    ngOnInit() {
        this.dataSource.data = this.data;
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }
}
