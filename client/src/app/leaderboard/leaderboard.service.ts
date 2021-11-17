import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameMode, Score } from '@app/leaderboard/leaderboard.interface';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
    url = `${environment.serverUrl}/scores`;
    scores$ = new BehaviorSubject<Score[]>([]);
    constructor(private http: HttpClient) {}

    getLeaderBoard(gameMode: GameMode): void {
        const params = new HttpParams().set('gameMode', gameMode);
        this.http.get<Score[]>(`${this.url}/gameMode?`, { params }).subscribe((scores: Score[]) => {
            this.scores$.next(scores);
        });
    }

    updateLeaderboard(mode: GameMode, score: Score) {
        this.http.post(`${this.url}/gameMode?gameMode=${mode}`, score, { responseType: 'text' }).subscribe();
    }
}
