import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameMode } from '@app/components/leaderboard.interface';
import { LeaderboardComponent } from '@app/components/modals/leaderboard/leaderboard.component';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
    constructor(private matDialog: MatDialog) {}
    openLeaderboard() {
        this.matDialog.open(LeaderboardComponent, {
            width: '350px',
            data: GameMode.Classic,
        });
    }
}
