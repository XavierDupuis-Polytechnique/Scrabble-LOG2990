import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeaderboardComponent } from '@app/components/modals/leaderboard/leaderboard.component';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
    constructor(private matDialog: MatDialog, private http: HttpClient) {}
    openLeaderboard() {
        // this.http.get(`${environment.serverUrl}/api/scores?gameMode=classic`).subscribe((data) => {
        //     const letterOccurences = Object.entries(data);
        //     console.log(letterOccurences);
        // });
        this.matDialog.open(LeaderboardComponent, {
            width: '350px',
            panelClass: 'icon-outside',
        });
    }
}
