import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameMode, Score } from '@app/components/leaderboard.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
    constructor(private http: HttpClient) {}

    // getHighestscores(gameMode: GameMode) {}

    getLeaderBoard(gameMode: GameMode): Observable<Score[]> {
        const params = new HttpParams().set('gameMode', gameMode);
        return this.http.get(`${environment.serverUrl}/scores/gameMode?`, { params }) as Observable<Score[]>;
    }
}
