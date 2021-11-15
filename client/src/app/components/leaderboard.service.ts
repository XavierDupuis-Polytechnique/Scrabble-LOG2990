import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameMode, Score } from '@app/components/leaderboard.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
    constructor(private http: HttpClient) {}

    getLeaderBoard(gameMode: GameMode): Observable<Score[]> {
        const params = new HttpParams().set('gameMode', gameMode);

        return this.http.get(`${environment.serverUrl}/scores/gameMode?`, { params }) as Observable<Score[]>;
    }

    // getHighestscores(scores: Map<string, number>) {
    //     const highestScores = new Map<string[], number>();
    //     const currentHighScore = 0;
    //     for (const score of scores) {
    //         const playerName = score[0];
    //         const point = score[1];
    //         if (point > currentHighScore) {
    //             highestScores.set([playerName], point);
    //         } else if (point === currentHighScore)
    //     }
    // }
}
